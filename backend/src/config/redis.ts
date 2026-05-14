import { Redis } from "ioredis";

import { env } from "./env.js";

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (!env.REDIS_URL) {
    return null;
  }
  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }
  return redis;
}

export async function pingRedis(): Promise<"ok" | "skipped" | "error"> {
  const client = getRedis();
  if (!client) return "skipped";
  try {
    await client.connect();
    await client.ping();
    return "ok";
  } catch {
    return "error";
  }
}
