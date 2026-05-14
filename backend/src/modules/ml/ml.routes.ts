import { Router } from "express";

import { mlController } from "../../controllers/ml.controller.js";
import { optionalAuthenticate } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/validateRequest.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  mlAnalyzeBodySchema,
  mlPredictBodySchema,
  mlRecommendBodySchema,
  mlStrategyBodySchema,
} from "./ml.schemas.js";

export const mlRouter = Router();

mlRouter.post(
  "/predict",
  optionalAuthenticate(),
  validateBody(mlPredictBodySchema),
  asyncHandler(mlController.predict),
);
mlRouter.post(
  "/recommend",
  optionalAuthenticate(),
  validateBody(mlRecommendBodySchema),
  asyncHandler(mlController.recommend),
);
mlRouter.post(
  "/analyze",
  optionalAuthenticate(),
  validateBody(mlAnalyzeBodySchema),
  asyncHandler(mlController.analyze),
);
mlRouter.post(
  "/strategy",
  optionalAuthenticate(),
  validateBody(mlStrategyBodySchema),
  asyncHandler(mlController.strategy),
);
