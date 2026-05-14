import { Router } from "express";

import { predictorController } from "../../controllers/predictor.controller.js";
import { authenticate, optionalAuthenticate } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/validateRequest.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { jeePredictBodySchema, predictorHistoryQuerySchema } from "./predictor.schemas.js";

export const predictorRouter = Router();

predictorRouter.post(
  "/",
  optionalAuthenticate(),
  validateBody(jeePredictBodySchema),
  asyncHandler(predictorController.jeePredict),
);
predictorRouter.get(
  "/history",
  authenticate(),
  validateQuery(predictorHistoryQuerySchema),
  asyncHandler(predictorController.history),
);
