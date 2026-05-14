import { emitEngineEvent } from "../analytics-engine/index.js";
import { mlGatewayPost } from "../ml-services/mlGateway.js";
import type { MlAnalyzeBody, MlRecommendBody, MlStrategyBody } from "../modules/ml/ml.schemas.js";
import { recommendPlaceholder } from "../recommendation-engine/index.js";
import { buildStrategyHints } from "../strategy-engine/index.js";

export const mlService = {
  async predictProxy(body: Record<string, unknown>) {
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
  },

  async recommend(body: MlRecommendBody) {
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
  },

  async analyze(body: MlAnalyzeBody) {
    const remote = await mlGatewayPost({ path: "/analyze", body });
    if (remote?.ok) {
      return { source: "python" as const, data: remote.data };
    }
    emitEngineEvent({
      engine: "analytics-engine",
      name: body.event,
      ...(body.payload !== undefined ? { payload: body.payload } : {}),
    });
    return {
      source: "placeholder" as const,
      data: { ok: true, queued: false, note: "Wire async workers (BullMQ) for heavy analysis." },
    };
  },

  async strategy(body: MlStrategyBody) {
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
  },
};
