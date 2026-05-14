export const QUEUE_NAMES = {
  SCRAPING: "scraping",
  INGESTION: "ingestion",
  ML_PROCESSING: "ml-processing",
  NOTIFICATIONS: "notifications",
  ANALYTICS: "analytics",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
