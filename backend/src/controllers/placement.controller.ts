import type { Request, Response } from "express";

import { placementService } from "../services/placement.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendPaginated } from "../utils/apiResponse.js";
import type { PlacementListQuery } from "../modules/placements/placement.schemas.js";

export const placementController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as PlacementListQuery;
    const { items, total } = await placementService.list(query);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),
};
