import { Router } from "express";

import { counselingController } from "../../controllers/counseling.controller.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { counselingListQuerySchema } from "./counseling.schemas.js";

export const counselingRouter = Router();

counselingRouter.get("/", validateQuery(counselingListQuerySchema), asyncHandler(counselingController.list));
counselingRouter.get("/:slug", asyncHandler(counselingController.getBySlug));
