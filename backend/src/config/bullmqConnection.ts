import { Redis } from "ioredis";

import { env } from "./env.js";

/**
 * BullMQ requires `maxRetriesPerRequest: null` on the ioredis client.
 */
export function createBullConnection(): Redis {
  if (!env.REDIS_URL) {
    throw new Error("REDIS_URL is required for BullMQ queues and workers.");
  }
  return new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
  });
}
