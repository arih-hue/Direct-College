import "dotenv/config";

import { env } from "../config/env.js";
import { registerRepeatableJobs } from "../queues/registerRepeatableJobs.js";
import { closeBrowser } from "../scrapers/browser.js";
import { closeAllWorkers, startAllWorkers } from "./workerRuntime.js";

async function main() {
  if (!env.REDIS_URL) {
    throw new Error("REDIS_URL is required to run BullMQ workers.");
  }
  await startAllWorkers();
  await registerRepeatableJobs();
  console.log("BullMQ workers started (scraping, ingestion, ml-processing, notifications, analytics).");
  if (env.ENABLE_QUEUE_CRON) {
    console.log("Repeatable scrape cron registered (NIRF 04:00, JoSAA 05:00, CSAB 06:00 UTC).");
  }

  const shutdown = async () => {
    await closeAllWorkers();
    await closeBrowser();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown());
  process.on("SIGTERM", () => void shutdown());
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
