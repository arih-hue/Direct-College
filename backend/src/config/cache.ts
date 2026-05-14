import { getRedis } from "./redis.js";

const PREFIX = "dc:cache:";

async function withClient<T>(fn: (c: NonNullable<ReturnType<typeof getRedis>>) => Promise<T>): Promise<T | null> {
  const client = getRedis();
  if (!client) return null;
  try {
    await client.connect();
  } catch {
    return null;
  }
  try {
    return await fn(client);
  } catch {
    return null;
  }
}

export const appCache = {
  async get(key: string): Promise<string | null> {
    return withClient((c) => c.get(`${PREFIX}${key}`));
  },

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await withClient(async (c) => {
      await c.set(`${PREFIX}${key}`, value, "EX", ttlSeconds);
      return null;
    });
  },

  async incr(key: string): Promise<number | null> {
    return withClient((c) => c.incr(`${PREFIX}${key}`));
  },
};

export function stableCacheKey(parts: object): string {
  const entries = Object.entries(parts)
    .filter(([, v]) => v !== undefined && v !== "")
    .sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(Object.fromEntries(entries));
}
