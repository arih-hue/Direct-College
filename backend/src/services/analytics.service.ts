import { prisma } from "../config/database.js";
import { appCache, getOrSet, stableCacheKey } from "../config/cache.js";
import { CacheNS, CacheTTL, cacheKey } from "../config/cacheKeys.js";
import type {
  AnalyticsSummaryQuery,
  PopularCollegesQuery,
} from "../modules/analytics/analytics.schemas.js";

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, delta: number): Date {
  const copy = new Date(d);
  copy.setUTCDate(copy.getUTCDate() + delta);
  return copy;
}

async function trackCounter(name: string, field: string, increment = 1): Promise<void> {
  const dk = cacheKey(CacheNS.analytics, "day", dayKey(new Date()));
  await appCache.hincrby(dk, `${name}:${field}`, increment);
}

export const analyticsService = {
  async recordEvent(input: { name: string; properties?: unknown; userId?: string }): Promise<void> {
    const clientKey = cacheKey(CacheNS.analytics, "day", dayKey(new Date()));
    await appCache.hincrby(clientKey, input.name, 1);

    if (input.properties && typeof input.properties === "object" && input.properties !== null) {
      const props = input.properties as Record<string, unknown>;
      if (typeof props["collegeId"] === "string") {
        await trackCounter("college_view", props["collegeId"]);
      }
      if (Array.isArray(props["collegeIds"])) {
        const ids = props["collegeIds"] as string[];
        const pair = [...ids].sort().join(",");
        await trackCounter("comparison", pair);
      }
    }

    if (input.properties !== undefined) {
      const logKey = cacheKey(CacheNS.analytics, "log", dayKey(new Date()), input.name);
      const entry = JSON.stringify({
        ts: Date.now(),
        userId: input.userId ?? null,
        properties: input.properties,
      });
      const existing = await appCache.get(logKey);
      const list = existing ? (JSON.parse(existing) as unknown[]) : [];
      list.unshift(JSON.parse(entry));
      await appCache.set(logKey, JSON.stringify(list.slice(0, 200)), 60 * 60 * 24 * 14);
    }
  },

  async summary(query: AnalyticsSummaryQuery) {
    const key = cacheKey(CacheNS.analytics, "summary", stableCacheKey(query));
    const { data } = await getOrSet(key, CacheTTL.ANALYTICS, async () => {
      const buckets: Array<{ date: string; counts: Record<string, string> }> = [];
      const today = new Date();
      for (let i = query.days - 1; i >= 0; i -= 1) {
        const d = addDays(today, -i);
        const dk = cacheKey(CacheNS.analytics, "day", dayKey(d));
        const counts = (await appCache.hgetall(dk)) ?? {};
        buckets.push({ date: dayKey(d), counts });
      }
      return { days: query.days, buckets };
    });
    return data;
  },

  async popularColleges(query: PopularCollegesQuery) {
    const key = cacheKey(CacheNS.analytics, "popular", String(query.limit));
    const { data } = await getOrSet(key, CacheTTL.ANALYTICS, async () => {
      const counterKey = cacheKey(CacheNS.analytics, "day", dayKey(new Date()));
      const counts = (await appCache.hgetall(counterKey)) ?? {};
      const collegeViews = Object.entries(counts)
        .filter(([k]) => k.startsWith("college_view:"))
        .map(([k, v]) => ({ collegeId: k.replace("college_view:", ""), views: Number(v) || 0 }))
        .sort((a, b) => b.views - a.views)
        .slice(0, query.limit);

      const ids = collegeViews.map((c) => c.collegeId);
      const colleges =
        ids.length > 0
          ? await prisma.college.findMany({
              where: { id: { in: ids } },
              select: { id: true, name: true, slug: true, state: true, city: true },
            })
          : [];

      const byId = new Map(colleges.map((c) => [c.id, c]));
      const fromRedis = collegeViews
        .map((v) => {
          const c = byId.get(v.collegeId);
          return c ? { ...c, views: v.views, source: "redis" as const } : null;
        })
        .filter(Boolean);

      if (fromRedis.length >= query.limit) {
        return { items: fromRedis };
      }

      const fallback = await prisma.college.findMany({
        take: query.limit,
        orderBy: { updatedAt: "desc" },
        select: { id: true, name: true, slug: true, state: true, city: true },
      });
      return {
        items: fallback.map((c) => ({ ...c, views: 0, source: "recent" as const })),
      };
    });
    return data;
  },

  async predictionAnalytics(days: number) {
    const key = cacheKey(CacheNS.analytics, "predictions", String(days));
    const { data } = await getOrSet(key, CacheTTL.ANALYTICS, async () => {
      const since = addDays(new Date(), -days);
      const [total, byDay, avgConfidence] = await Promise.all([
        prisma.aIPrediction.count({ where: { createdAt: { gte: since } } }),
        prisma.aIPrediction.groupBy({
          by: ["modelName"],
          where: { createdAt: { gte: since } },
          _count: { _all: true },
        }),
        prisma.aIPrediction.aggregate({
          where: { createdAt: { gte: since }, confidence: { not: null } },
          _avg: { confidence: true },
        }),
      ]);
      return {
        days,
        totalPredictions: total,
        avgConfidence: avgConfidence._avg.confidence,
        byModel: byDay.map((r) => ({ model: r.modelName, count: r._count._all })),
      };
    });
    return data;
  },

  async engagementMetrics(days: number) {
    const key = cacheKey(CacheNS.analytics, "engagement", String(days));
    const { data } = await getOrSet(key, CacheTTL.ANALYTICS, async () => {
      const since = addDays(new Date(), -days);
      const [users, reviews, comparisons, predictions] = await Promise.all([
        prisma.user.count({ where: { createdAt: { gte: since } } }),
        prisma.review.count({ where: { createdAt: { gte: since } } }),
        prisma.comparisonHistory.count({ where: { createdAt: { gte: since } } }),
        prisma.aIPrediction.count({ where: { createdAt: { gte: since } } }),
      ]);
      return { days, newUsers: users, reviews, comparisons, predictions };
    });
    return data;
  },

  async comparisonTrends(limit: number) {
    const key = cacheKey(CacheNS.analytics, "comparison-trends", String(limit));
    const { data } = await getOrSet(key, CacheTTL.ANALYTICS, async () => {
      const counterKey = cacheKey(CacheNS.analytics, "day", dayKey(new Date()));
      const counts = (await appCache.hgetall(counterKey)) ?? {};
      const pairs = Object.entries(counts)
        .filter(([k]) => k.startsWith("comparison:"))
        .map(([k, v]) => ({ pair: k.replace("comparison:", ""), count: Number(v) || 0 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      if (pairs.length > 0) {
        return { items: pairs };
      }

      const recent = await prisma.comparisonHistory.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        select: { collegeIds: true, createdAt: true },
      });
      const freq = new Map<string, number>();
      for (const row of recent) {
        const pair = [...row.collegeIds].sort().join(",");
        freq.set(pair, (freq.get(pair) ?? 0) + 1);
      }
      const items = [...freq.entries()]
        .map(([pair, count]) => ({ pair, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
      return { items };
    });
    return data;
  },
};
