export { processScrapingJob } from "./processors/scraping.processor.js";
export { processIngestionJob } from "./processors/ingestion.processor.js";
export { processMlJob } from "./processors/ml.processor.js";
export { processNotificationJob } from "./processors/notifications.processor.js";
export { processAnalyticsJob } from "./processors/analytics.processor.js";

export async function startDefaultWorkers(): Promise<void> {
  const { startAllWorkers } = await import("../workers/workerRuntime.js");
  await startAllWorkers();
}
