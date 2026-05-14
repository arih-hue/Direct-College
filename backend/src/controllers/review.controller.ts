import type { Request, Response } from "express";

import { reviewService } from "../services/review.service.js";
import { AppError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOk, sendPaginated } from "../utils/apiResponse.js";
import type { ReviewCreateBody, ReviewListQuery } from "../modules/reviews/review.schemas.js";

export const reviewController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as ReviewListQuery;
    const { items, total } = await reviewService.list(query);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.auth) {
      throw new AppError(401, "UNAUTHORIZED", "Not authenticated.");
    }
    const body = req.body as ReviewCreateBody;
    const created = await reviewService.create(req.auth.userId, body);
    sendOk(res, created, 201);
  }),
};
