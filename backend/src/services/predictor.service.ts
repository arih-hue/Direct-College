import type { Prisma } from "@prisma/client";

import { emitEngineEvent } from "../analytics-engine/index.js";
import { appCache, stableCacheKey } from "../config/cache.js";
import { mlGatewayPost } from "../ml-services/mlGateway.js";
import { applyHomeStateBonus, bucketFromClosing, type ChanceBucket } from "../predictor-engine/index.js";
import type { JeePredictBody, PredictorHistoryQuery } from "../modules/predictor/predictor.schemas.js";
import { predictionRepository } from "../repositories/prediction.repository.js";
import { jeePredictorRepository } from "../repositories/jeePredictor.repository.js";
import { clampPageSize, toSkip } from "../utils/pagination.js";

export type JeeCollegePrediction = {
  collegeId: string;
  name: string;
  slug: string;
  state: string | null;
  bestClosingRank: number;
  effectiveClosingRank: number;
  bucket: ChanceBucket;
};

export type JeePredictResult = {
  SAFE: JeeCollegePrediction[];
  MODERATE: JeeCollegePrediction[];
  DREAM: JeeCollegePrediction[];
  meta: {
    year: number;
    category: string;
    studentRank: number;
    totalCollegesEvaluated: number;
    fromCache: boolean;
    mlServiceHit: boolean;
    mlEnrichment?: unknown;
  };
};

const CACHE_TTL_SECONDS = 120;

function sortColleges(list: JeeCollegePrediction[]): JeeCollegePrediction[] {
  return [...list].sort((a, b) => {
    if (b.effectiveClosingRank !== a.effectiveClosingRank) {
      return b.effectiveClosingRank - a.effectiveClosingRank;
    }
    return a.name.localeCompare(b.name);
  });
}

async function computeJeeBuckets(body: JeePredictBody): Promise<Omit<JeePredictResult, "meta"> & { year: number }> {
  const year = body.year ?? (await jeePredictorRepository.getLatestCutoffYear()) ?? new Date().getFullYear();

  const rows = await jeePredictorRepository.aggregateBestClosingByCollege({
    year,
    category: body.category,
    branchPreferences: body.branchPreferences,
  });

  const SAFE: JeeCollegePrediction[] = [];
  const MODERATE: JeeCollegePrediction[] = [];
  const DREAM: JeeCollegePrediction[] = [];

  for (const row of rows) {
    const adjusted = applyHomeStateBonus(row.bestClosing, row.collegeState, body.state);
    const bucket = bucketFromClosing({
      studentRank: body.rank,
      bestClosingRank: adjusted,
    });

    const item: JeeCollegePrediction = {
      collegeId: row.collegeId,
      name: row.collegeName,
      slug: row.collegeSlug,
      state: row.collegeState,
      bestClosingRank: row.bestClosing,
      effectiveClosingRank: adjusted,
      bucket,
    };

    if (bucket === "SAFE") SAFE.push(item);
    else if (bucket === "MODERATE") MODERATE.push(item);
    else DREAM.push(item);
  }

  return {
    year,
    SAFE: sortColleges(SAFE),
    MODERATE: sortColleges(MODERATE),
    DREAM: sortColleges(DREAM),
  };
}

export const predictorService = {
  async jeePredict(body: JeePredictBody, userId?: string): Promise<JeePredictResult> {
    const cacheKey = `jee:predict:${stableCacheKey(body)}`;
    const cached = await appCache.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as JeePredictResult;
      emitEngineEvent({
        engine: "predictor",
        name: "jee_predict_cache_hit",
        payload: { studentRank: body.rank },
      });
      return {
        ...parsed,
        meta: { ...parsed.meta, fromCache: true },
      };
    }

    const computed = await computeJeeBuckets(body);

    let mlServiceHit = false;
    let mlEnrichment: unknown;
    const remote = await mlGatewayPost<Record<string, unknown>>({
      path: "/internal/jee-enrich",
      body: {
        rank: body.rank,
        category: body.category,
        gender: body.gender,
        state: body.state,
        branchPreferences: body.branchPreferences,
        buckets: {
          SAFE: computed.SAFE.slice(0, 50),
          MODERATE: computed.MODERATE.slice(0, 50),
          DREAM: computed.DREAM.slice(0, 50),
        },
      },
    });
    if (remote !== null) {
      mlServiceHit = remote.ok;
      if (remote.ok && "enrichment" in remote.data) {
        mlEnrichment = remote.data["enrichment"];
      }
    }

    const result: JeePredictResult = {
      SAFE: computed.SAFE,
      MODERATE: computed.MODERATE,
      DREAM: computed.DREAM,
      meta: {
        year: computed.year,
        category: body.category.trim(),
        studentRank: body.rank,
        totalCollegesEvaluated: computed.SAFE.length + computed.MODERATE.length + computed.DREAM.length,
        fromCache: false,
        mlServiceHit,
        ...(mlEnrichment !== undefined ? { mlEnrichment } : {}),
      },
    };

    await appCache.set(cacheKey, JSON.stringify(result), CACHE_TTL_SECONDS);

    const persistInput = {
      rank: body.rank,
      category: body.category,
      gender: body.gender,
      state: body.state,
      branchPreferences: body.branchPreferences,
      year: computed.year,
    };

    await predictionRepository.create({
      modelName: "jee-cutoff-v1",
      modelVersion: "1.0.0",
      input: persistInput,
      output: JSON.parse(JSON.stringify(result)) as Prisma.InputJsonValue,
      confidence:
        computed.SAFE.length + computed.MODERATE.length > 0
          ? Math.min(
              1,
              (computed.SAFE.length * 0.6 + computed.MODERATE.length * 0.25) /
                (computed.SAFE.length + computed.MODERATE.length + 1),
            )
          : 0.1,
      ...(userId ? { user: { connect: { id: userId } } } : {}),
    });

    emitEngineEvent({
      engine: "predictor",
      name: "jee_predict_computed",
      payload: { total: result.meta.totalCollegesEvaluated, mlServiceHit },
    });

    return result;
  },

  async listMine(userId: string, query: PredictorHistoryQuery) {
    const pageSize = clampPageSize(query.pageSize, 100);
    const skip = toSkip(query.page, pageSize);
    return predictionRepository.listForUser(userId, pageSize, skip);
  },
};
