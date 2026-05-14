import { Router } from "express";

import { placementController } from "../../controllers/placement.controller.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { placementListQuerySchema } from "./placement.schemas.js";

export const placementRouter = Router();

placementRouter.get("/", validateQuery(placementListQuerySchema), asyncHandler(placementController.list));
