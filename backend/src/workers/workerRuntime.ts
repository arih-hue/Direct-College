import { Worker, type Processor } from "bullmq";
import type { Redis } from "ioredis";

import { createBullConnection } from "../config/bullmqConnection.js";
import { processAnalyticsJob } from "../jobs/processors/analytics.processor.js";
import { processIngestionJob } from "../jobs/processors/ingestion.processor.js";
import { processMlJob } from "../jobs/processors/ml.processor.js";
import { processNotificationJob } from "../jobs/processors/notifications.processor.js";
import { processScrapingJob } from "../jobs/processors/scraping.processor.js";
import { QUEUE_NAMES } from "../queues/queueNames.js";

const workers: Worker[] = [];
let sharedConnection: Redis | null = null;

function register<T>(name: string, processor: Processor<T>, concurrency: number): void {
  if (!sharedConnection) {
    sharedConnection = createBullConnection();
  }
  workers.push(
    new Worker<T>(name, processor, {
      connection: sharedConnection.duplicate(),
      concurrency,
    }),
  );
}

export async function startAllWorkers(): Promise<void> {
  if (workers.length > 0) {
    return;
  }

  register(QUEUE_NAMES.SCRAPING, processScrapingJob, 2);
  register(QUEUE_NAMES.INGESTION, processIngestionJob, 1);
  register(QUEUE_NAMES.ML_PROCESSING, processMlJob, 2);
  register(QUEUE_NAMES.NOTIFICATIONS, processNotificationJob, 4);
  register(QUEUE_NAMES.ANALYTICS, processAnalyticsJob, 8);
}

export async function closeAllWorkers(): Promise<void> {
  await Promise.all(workers.map((w) => w.close()));
  workers.length = 0;
  if (sharedConnection) {
    await sharedConnection.quit();
    sharedConnection = null;
  }
}
