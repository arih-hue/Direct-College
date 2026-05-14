import type { Job } from "bullmq";

import { prisma } from "../../config/database.js";
import type { ScrapingJobPayload } from "../../queues/producers.js";
import { scrapeJobRepository } from "../../repositories/scrapeJob.repository.js";
import { getScraper } from "../../scrapers/registry.js";

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
        metadata: d.metadata ?? undefined,
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
    await scrapeJobRepository.log(scrapeJobId, level, message, metadata);
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
      log,
    });

    await scrapeJobRepository.updateStatus(scrapeJobId, {
      status: "COMPLETED",
      resultPayload: result as unknown as import("@prisma/client").Prisma.InputJsonValue,
      completedAt: new Date(),
      errorMessage: null,
    });
    await log("info", "Scrape job completed", { attempts: job.attemptsMade });
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
