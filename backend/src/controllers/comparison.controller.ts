import type { Request, Response } from "express";

import { comparisonService } from "../services/comparison.service.js";
import { AppError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOk, sendPaginated } from "../utils/apiResponse.js";
import type { ComparisonCreateBody, ComparisonHistoryListQuery } from "../modules/comparisons/comparison.schemas.js";

export const comparisonController = {
  listMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.auth) {
      throw new AppError(401, "UNAUTHORIZED", "Not authenticated.");
    }
    const query = req.query as unknown as ComparisonHistoryListQuery;
    const { items, total } = await comparisonService.listMine(req.auth.userId, query);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as ComparisonCreateBody;
    const created = await comparisonService.create(req.auth?.userId, body);
    sendOk(res, created, 201);
  }),
};
