import type { Request, Response } from "express";

import { collegeService } from "../services/college.service.js";
import { AppError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOk, sendPaginated } from "../utils/apiResponse.js";
import { firstStringParam } from "../utils/params.js";
import type { CollegeListQuery } from "../modules/colleges/college.schemas.js";

export const collegeController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as CollegeListQuery;
    const { items, total } = await collegeService.list(query);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),

  getByIdentifier: asyncHandler(async (req: Request, res: Response) => {
    const identifier = firstStringParam(req.params["identifier"]);
    if (!identifier) {
      throw new AppError(400, "INVALID_PARAMS", "Missing identifier.");
    }
    const college = await collegeService.getByIdentifier(identifier);
    if (!college) {
      throw new AppError(404, "NOT_FOUND", "College not found.");
    }
    sendOk(res, college);
  }),
};
