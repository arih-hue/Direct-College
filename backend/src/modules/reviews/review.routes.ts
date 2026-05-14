import { Router } from "express";

import { reviewController } from "../../controllers/review.controller.js";
import { authenticate } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/validateRequest.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { reviewCreateBodySchema, reviewListQuerySchema } from "./review.schemas.js";

export const reviewRouter = Router();

reviewRouter.get("/", validateQuery(reviewListQuerySchema), asyncHandler(reviewController.list));
reviewRouter.post(
  "/",
  authenticate(),
  validateBody(reviewCreateBodySchema),
  asyncHandler(reviewController.create),
);
