import type { Request, Response } from "express";

import { mentorService } from "../services/mentor.service.js";
import { AppError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOk, sendPaginated } from "../utils/apiResponse.js";
import { firstStringParam } from "../utils/params.js";
import type { MentorListQuery } from "../modules/mentors/mentor.schemas.js";

export const mentorController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as MentorListQuery;
    const { items, total } = await mentorService.list(query);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = firstStringParam(req.params["id"]);
    if (!id) {
      throw new AppError(400, "INVALID_PARAMS", "Missing mentor id.");
    }
    const mentor = await mentorService.getById(id);
    if (!mentor) {
      throw new AppError(404, "NOT_FOUND", "Mentor not found.");
    }
    sendOk(res, mentor);
  }),
};
