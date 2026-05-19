import type { Job } from "bullmq";

import { prisma } from "../../config/database.js";
import type { ScrapingJobPayload } from "../../queues/producers.js";
import { enqueueIngestionJob } from "../../queues/producers.js";
import { scrapeJobRepository } from "../../repositories/scrapeJob.repository.js";
import { getScraper } from "../../scrapers/registry.js";
import { saveScrapeSnapshot } from "../../scrapers/snapshotStore.js";

async function resolveScrapeJobId(job: Job<ScrapingJobPayload>): Promise<string> {
  const d = job.data;
  if ("scrapeJobId" in d && d.scrapeJobId) {
    return d.scrapeJobId;
  }
  if ("sourceType" in d && d.sourceType) {
    const row = await prisma.scrapeJob.create({
      data: {
        sourceType: d.sourceType,
        targetUrl: d.targetUrl,
        metadata: d.metadata as import("@prisma/client").Prisma.InputJsonValue | undefined,
        status: "PENDING",
        bullJobId: typeof job.id === "string" ? job.id : String(job.id),
      },
    });
    return row.id;
  }
  throw new Error("Invalid scraping job payload");
}

export async function processScrapingJob(job: Job<ScrapingJobPayload>): Promise<void> {
  const scrapeJobId = await resolveScrapeJobId(job);
  const row = await prisma.scrapeJob.findUnique({ where: { id: scrapeJobId } });
  if (!row) {
    throw new Error(`ScrapeJob not found: ${scrapeJobId}`);
  }

  const maxAttempts = job.opts.attempts ?? 5;

  const log = async (level: string, message: string, metadata?: Record<string, unknown>) => {
    await scrapeJobRepository.log(scrapeJobId, level, message, metadata as import("@prisma/client").Prisma.InputJsonValue | undefined);
  };

  await scrapeJobRepository.updateStatus(scrapeJobId, {
    status: "RUNNING",
    attemptCount: job.attemptsMade,
    errorMessage: null,
    startedAt: job.attemptsMade <= 1 ? new Date() : row.startedAt ?? new Date(),
  });

  try {
    const scraper = getScraper(row.sourceType);
    const result = await scraper({
      sourceType: row.sourceType,
      targetUrl: row.targetUrl,
      scrapeJobId,
      log,
      storeSnapshot: async (content, ext = "html") => {
        const uri = await saveScrapeSnapshot(scrapeJobId, content, ext);
        await scrapeJobRepository.updateStatus(scrapeJobId, { status: "RUNNING", htmlSnapshotUri: uri });
        return uri;
      },
    });

    await scrapeJobRepository.updateStatus(scrapeJobId, {
      status: "COMPLETED",
      resultPayload: result as unknown as import("@prisma/client").Prisma.InputJsonValue,
      completedAt: new Date(),
      errorMessage: null,
      ...(result.htmlSnapshotUri ? { htmlSnapshotUri: result.htmlSnapshotUri } : {}),
    });
    await log("info", "Scrape job completed", { attempts: job.attemptsMade });

    if (result.ingestionFollowUp) {
      const follow = result.ingestionFollowUp;
      const enqueued = await enqueueIngestionJob({
        agency: follow.agency,
        format: follow.format,
        sourceUri: follow.sourceUri,
        metadata: {
          entityType: follow.entityType ?? "placement",
          commit: false,
          sourceScrapeJobId: scrapeJobId,
        },
      });
      await log("info", "Follow-up ingestion job enqueued", enqueued);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await log("error", msg, { attempt: job.attemptsMade });
    const isFinal = job.attemptsMade >= maxAttempts;
    await scrapeJobRepository.updateStatus(scrapeJobId, {
      status: isFinal ? "FAILED" : "PENDING",
      errorMessage: msg,
      completedAt: isFinal ? new Date() : null,
    });
    throw err;
  }
}
