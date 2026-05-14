import "dotenv/config";

import { env } from "../config/env.js";
import { closeBrowser } from "../scrapers/browser.js";
import { closeAllWorkers, startAllWorkers } from "./workerRuntime.js";

async function main() {
  if (!env.REDIS_URL) {
    throw new Error("REDIS_URL is required to run BullMQ workers.");
  }
  await startAllWorkers();
  console.log("BullMQ workers started (scraping, ingestion, ml-processing, notifications, analytics).");

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
