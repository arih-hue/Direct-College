export { QUEUE_NAMES, type QueueName } from "./queueNames.js";
export { getQueue, getAllQueueNames } from "./queues.js";
export { defaultJobOptions } from "./defaultJobOptions.js";
export {
  enqueueScrapeJob,
  enqueueIngestionJob,
  enqueueMlJob,
  enqueueNotification,
  enqueueAnalyticsJob,
} from "./producers.js";
export { registerRepeatableJobs } from "./registerRepeatableJobs.js";

export async function registerDefaultQueues(): Promise<void> {
  const { getAllQueueNames, getQueue } = await import("./queues.js");
  for (const name of getAllQueueNames()) {
    getQueue(name);
  }
}
