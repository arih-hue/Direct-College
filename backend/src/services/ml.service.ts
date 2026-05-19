import { prisma } from "../config/database.js";
import { getOrSet, stableCacheKey } from "../config/cache.js";
import { CacheNS, CacheTTL, cacheKey } from "../config/cacheKeys.js";
import { mlGatewayPost } from "../ml-services/mlGateway.js";
import type { MlAnalyzeBody, MlRecommendBody, MlStrategyBody } from "../modules/ml/ml.schemas.js";
import { env } from "../config/env.js";
import { enqueueMlJob } from "../queues/producers.js";
import { recommendPlaceholder } from "../recommendation-engine/index.js";
import { buildStrategyHints } from "../strategy-engine/index.js";
import { emitEngineEvent } from "../analytics-engine/index.js";
import { appCache } from "../config/cache.js";

async function trackMlCache(hit: boolean): Promise<void> {
  await appCache.hincrby(`${CacheNS.ai}:stats`, hit ? "hits" : "misses", 1);
}

export const mlService = {
  async predictProxy(body: Record<string, unknown>) {
    const key = cacheKey(CacheNS.ai, "predict", stableCacheKey(body));
    const cached = await getOrSet(key, CacheTTL.AI, async () => {
      await trackMlCache(false);
      const remote = await mlGatewayPost({ path: "/predict", body });
      if (remote?.ok) {
        return { source: "python" as const, data: remote.data };
      }
      return {
        source: "placeholder" as const,
        data: {
          message: "ML_SERVICE_URL not configured or upstream unavailable; returning stub.",
          echo: body,
        },
      };
    });
    if (cached.fromCache) await trackMlCache(true);
    return cached.data;
  },

  async recommend(body: MlRecommendBody) {
    const key = cacheKey(CacheNS.ai, "recommend", stableCacheKey(body));
    const cached = await getOrSet(key, CacheTTL.AI, async () => {
      await trackMlCache(false);
      const remote = await mlGatewayPost({ path: "/recommend", body });
      if (remote?.ok) {
        return { source: "python" as const, data: remote.data };
      }
      const local = await recommendPlaceholder({
        limit: body.limit,
        ...(body.userId !== undefined ? { userId: body.userId } : {}),
        ...(body.collegeIds !== undefined ? { collegeIds: body.collegeIds } : {}),
      });
      return { source: "placeholder" as const, data: local };
    });
    if (cached.fromCache) await trackMlCache(true);
    return cached.data;
  },

  async analyze(body: MlAnalyzeBody) {
    const remote = await mlGatewayPost({ path: "/analyze", body });
    if (remote?.ok) {
      return { source: "python" as const, data: remote.data };
    }

    if (body.async && env.REDIS_URL) {
      try {
        await enqueueMlJob({
          kind: body.jobKind ?? "embed",
          refId: body.event,
          payload: { event: body.event, ...(body.payload !== undefined ? { context: body.payload } : {}) },
        });
        return {
          source: "placeholder" as const,
          data: {
            ok: true,
            queued: true,
            note: "Job enqueued on ml-processing queue; worker forwards to Python `/queue/ml` when ML_SERVICE_URL is set.",
          },
        };
      } catch {
        /* fall through */
      }
    }

    emitEngineEvent({
      engine: "analytics-engine",
      name: body.event,
      ...(body.payload !== undefined ? { payload: body.payload } : {}),
    });
    return {
      source: "placeholder" as const,
      data: { ok: true, queued: false, note: "Synchronous stub; pass async:true + Redis for BullMQ offload." },
    };
  },

  async strategy(body: MlStrategyBody) {
    const key = cacheKey(CacheNS.ai, "strategy", stableCacheKey(body));
    const cached = await getOrSet(key, CacheTTL.AI, async () => {
      const remote = await mlGatewayPost({ path: "/strategy", body });
      if (remote?.ok) {
        return { source: "python" as const, data: remote.data };
      }
      const hints = await buildStrategyHints({
        rank: body.rank,
        category: body.category,
        preferences: body.preferences ?? [],
      });
      return { source: "placeholder" as const, data: { hints } };
    });
    return cached.data;
  },
};
