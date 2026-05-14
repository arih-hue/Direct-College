import type { Request, Response } from "express";

import { counselingService } from "../services/counseling.service.js";
import { AppError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOk, sendPaginated } from "../utils/apiResponse.js";
import { firstStringParam } from "../utils/params.js";
import type { CounselingListQuery } from "../modules/counseling/counseling.schemas.js";

export const counselingController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as CounselingListQuery;
    const { items, total } = await counselingService.list(query);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const slug = firstStringParam(req.params["slug"]);
    if (!slug) {
      throw new AppError(400, "INVALID_PARAMS", "Missing slug.");
    }
    const strategy = await counselingService.getBySlug(slug);
    if (!strategy) {
      throw new AppError(404, "NOT_FOUND", "Strategy not found.");
    }
    sendOk(res, strategy);
  }),
};
