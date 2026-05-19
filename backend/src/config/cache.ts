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

  async del(key: string): Promise<void> {
    await withClient(async (c) => {
      await c.del(`${PREFIX}${key}`);
      return null;
    });
  },

  async delByPrefix(prefix: string): Promise<void> {
    await withClient(async (c) => {
      const fullPrefix = `${PREFIX}${prefix}`;
      let cursor = "0";
      do {
        const [next, keys] = await c.scan(cursor, "MATCH", `${fullPrefix}*`, "COUNT", 100);
        cursor = next;
        if (keys.length > 0) {
          await c.del(...keys);
        }
      } while (cursor !== "0");
      return null;
    });
  },

  async incr(key: string): Promise<number | null> {
    return withClient((c) => c.incr(`${PREFIX}${key}`));
  },

  async hincrby(key: string, field: string, increment = 1): Promise<number | null> {
    return withClient((c) => c.hincrby(`${PREFIX}${key}`, field, increment));
  },

  async hgetall(key: string): Promise<Record<string, string> | null> {
    return withClient((c) => c.hgetall(`${PREFIX}${key}`));
  },

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async setJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  },
};

export function stableCacheKey(parts: object): string {
  const entries = Object.entries(parts)
    .filter(([, v]) => v !== undefined && v !== "")
    .sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(Object.fromEntries(entries));
}

export async function getOrSet<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<{ data: T; fromCache: boolean }> {
  const cached = await appCache.getJson<T>(key);
  if (cached !== null) {
    return { data: cached, fromCache: true };
  }
  const data = await loader();
  await appCache.setJson(key, data, ttlSeconds);
  return { data, fromCache: false };
}
