import type { Request, Response } from "express";

import { predictorService } from "../services/predictor.service.js";
import { AppError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOk, sendPaginated } from "../utils/apiResponse.js";
import type { JeePredictBody, PredictorHistoryQuery } from "../modules/predictor/predictor.schemas.js";

export const predictorController = {
  jeePredict: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as JeePredictBody;
    const result = await predictorService.jeePredict(body, req.auth?.userId);
    sendOk(res, result, 200);
  }),

  history: asyncHandler(async (req: Request, res: Response) => {
    if (!req.auth) {
      throw new AppError(401, "UNAUTHORIZED", "Not authenticated.");
    }
    const query = req.query as unknown as PredictorHistoryQuery;
    const { items, total } = await predictorService.listMine(req.auth.userId, query);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),
};
