import { Router } from "express";

import { branchController } from "../../controllers/branch.controller.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { branchListQuerySchema } from "./branch.schemas.js";

export const branchRouter = Router();

branchRouter.get("/", validateQuery(branchListQuerySchema), asyncHandler(branchController.list));
