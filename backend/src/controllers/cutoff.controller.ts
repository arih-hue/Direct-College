import type { Request, Response } from "express";

import { cutoffService } from "../services/cutoff.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendPaginated } from "../utils/apiResponse.js";
import type { CutoffListQuery } from "../modules/cutoffs/cutoff.schemas.js";

export const cutoffController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as CutoffListQuery;
    const { items, total } = await cutoffService.list(query);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),
};
