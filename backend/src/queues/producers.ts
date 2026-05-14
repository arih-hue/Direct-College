import type { ScrapeSourceType } from "@prisma/client";

import { prisma } from "../config/database.js";
import { QUEUE_NAMES } from "./queueNames.js";
import { getQueue } from "./queues.js";

export type ScrapingJobPayload =
  | { scrapeJobId: string }
  | { sourceType: ScrapeSourceType; targetUrl?: string; metadata?: Record<string, unknown> };

export type IngestionJobPayload = {
  ingestionJobId: string;
};

export type MlProcessingPayload = {
  kind: "predict" | "embed" | "batch";
  refId?: string;
  payload?: Record<string, unknown>;
};

export type NotificationPayload = {
  channel: "email" | "push" | "webhook";
  template: string;
  to?: string;
  data?: Record<string, unknown>;
};

export type AnalyticsQueuePayload = {
  event: string;
  properties?: Record<string, unknown>;
};

export async function enqueueScrapeJob(input: {
  sourceType: ScrapeSourceType;
  targetUrl?: string;
  metadata?: Record<string, unknown>;
}): Promise<{ scrapeJobId: string; bullJobId: string | undefined }> {
  const row = await prisma.scrapeJob.create({
    data: {
      sourceType: input.sourceType,
      targetUrl: input.targetUrl,
      metadata: input.metadata ?? undefined,
      status: "PENDING",
    },
  });

  const job = await getQueue(QUEUE_NAMES.SCRAPING).add(
    "run",
    { scrapeJobId: row.id } satisfies ScrapingJobPayload,
    { jobId: row.id },
  );

  await prisma.scrapeJob.update({
    where: { id: row.id },
    data: { bullJobId: job.id },
  });

  return { scrapeJobId: row.id, bullJobId: job.id };
}

export async function enqueueIngestionJob(input: {
  agency: string;
  format: import("@prisma/client").IngestionFileFormat;
  sourceUri: string;
  metadata?: Record<string, unknown>;
}): Promise<{ ingestionJobId: string; bullJobId: string | undefined }> {
  const row = await prisma.ingestionJob.create({
    data: {
      agency: input.agency,
      format: input.format,
      sourceUri: input.sourceUri,
      metadata: input.metadata ?? undefined,
      status: "PENDING",
    },
  });

  const job = await getQueue(QUEUE_NAMES.INGESTION).add(
    "run",
    { ingestionJobId: row.id } satisfies IngestionJobPayload,
    { jobId: row.id },
  );

  await prisma.ingestionJob.update({
    where: { id: row.id },
    data: { bullJobId: job.id },
  });

  return { ingestionJobId: row.id, bullJobId: job.id };
}

export async function enqueueMlJob(data: MlProcessingPayload): Promise<void> {
  await getQueue(QUEUE_NAMES.ML_PROCESSING).add("run", data);
}

export async function enqueueNotification(data: NotificationPayload): Promise<void> {
  await getQueue(QUEUE_NAMES.NOTIFICATIONS).add("send", data);
}

export async function enqueueAnalyticsJob(data: AnalyticsQueuePayload): Promise<void> {
  await getQueue(QUEUE_NAMES.ANALYTICS).add("track", data);
}
