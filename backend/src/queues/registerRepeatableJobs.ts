import { env } from "../config/env.js";
import { QUEUE_NAMES } from "./queueNames.js";
import { getQueue } from "./queues.js";

/**
 * Registers BullMQ repeatable jobs (cron). Run once when workers boot.
 */
export async function registerRepeatableJobs(): Promise<void> {
  if (!env.ENABLE_QUEUE_CRON) {
    return;
  }

  const scraping = getQueue(QUEUE_NAMES.SCRAPING);

  await scraping.add(
    "scheduled-nirf",
    { sourceType: "NIRF" },
    {
      repeat: { pattern: "0 4 * * *" },
      jobId: "repeat-nirf-daily",
    },
  );

  await scraping.add(
    "scheduled-josaa",
    { sourceType: "JOSAA" },
    {
      repeat: { pattern: "0 5 * * *" },
      jobId: "repeat-josaa-daily",
    },
  );

  await scraping.add(
    "scheduled-csab",
    { sourceType: "CSAB" },
    {
      repeat: { pattern: "0 6 * * *" },
      jobId: "repeat-csab-daily",
    },
  );
}
