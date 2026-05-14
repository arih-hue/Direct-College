import { getRedis } from "../config/redis.js";
import type { AnalyticsSummaryQuery } from "../modules/analytics/analytics.schemas.js";

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, delta: number): Date {
  const copy = new Date(d);
  copy.setUTCDate(copy.getUTCDate() + delta);
  return copy;
}

export const analyticsService = {
  async recordEvent(input: { name: string; properties?: unknown; userId?: string }): Promise<void> {
    const client = getRedis();
    if (!client) return;
    try {
      await client.connect();
    } catch {
      return;
    }

    const dk = `dc:analytics:day:${dayKey(new Date())}`;
    try {
      await client.hincrby(dk, input.name, 1);
      await client.expire(dk, 60 * 60 * 24 * 45);
    } catch {
      return;
    }

    if (input.properties !== undefined) {
      const logKey = `dc:analytics:log:${dayKey(new Date())}:${input.name}`;
      try {
        await client.lpush(
          logKey,
          JSON.stringify({ ts: Date.now(), userId: input.userId ?? null, properties: input.properties }),
        );
        await client.ltrim(logKey, 0, 199);
        await client.expire(logKey, 60 * 60 * 24 * 14);
      } catch {
        // ignore log failures
      }
    }
  },

  async summary(query: AnalyticsSummaryQuery) {
    const client = getRedis();
    if (!client) {
      return { days: query.days, buckets: [] as Array<{ date: string; counts: Record<string, string> }> };
    }
    try {
      await client.connect();
    } catch {
      return { days: query.days, buckets: [] as Array<{ date: string; counts: Record<string, string> }> };
    }

    const buckets: Array<{ date: string; counts: Record<string, string> }> = [];
    const today = new Date();
    for (let i = query.days - 1; i >= 0; i -= 1) {
      const d = addDays(today, -i);
      const key = `dc:analytics:day:${dayKey(d)}`;
      try {
        const counts = await client.hgetall(key);
        buckets.push({ date: dayKey(d), counts });
      } catch {
        buckets.push({ date: dayKey(d), counts: {} });
      }
    }

    return { days: query.days, buckets };
  },
};
