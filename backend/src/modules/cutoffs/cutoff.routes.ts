import { Router } from "express";

import { cutoffController } from "../../controllers/cutoff.controller.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { cutoffListQuerySchema } from "./cutoff.schemas.js";

export const cutoffRouter = Router();

cutoffRouter.get("/", validateQuery(cutoffListQuerySchema), asyncHandler(cutoffController.list));
