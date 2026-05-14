import type { Request, Response } from "express";

import { mlService } from "../services/ml.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOk } from "../utils/apiResponse.js";
import type { MlAnalyzeBody, MlRecommendBody, MlStrategyBody } from "../modules/ml/ml.schemas.js";

export const mlController = {
  predict: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as Record<string, unknown>;
    const out = await mlService.predictProxy(body);
    sendOk(res, out);
  }),

  recommend: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as MlRecommendBody;
    const out = await mlService.recommend(body);
    sendOk(res, out);
  }),

  analyze: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as MlAnalyzeBody;
    const out = await mlService.analyze(body);
    sendOk(res, out);
  }),

  strategy: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as MlStrategyBody;
    const out = await mlService.strategy(body);
    sendOk(res, out);
  }),
};
