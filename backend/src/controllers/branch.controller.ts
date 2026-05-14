import type { Request, Response } from "express";

import { branchService } from "../services/branch.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendPaginated } from "../utils/apiResponse.js";
import type { BranchListQuery } from "../modules/branches/branch.schemas.js";

export const branchController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as BranchListQuery;
    const { items, total } = await branchService.list(query);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),
};
