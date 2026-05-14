import { Router } from "express";

import { comparisonController } from "../../controllers/comparison.controller.js";
import { authenticate } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/validateRequest.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { comparisonCreateBodySchema, comparisonHistoryListQuerySchema } from "./comparison.schemas.js";

export const comparisonRouter = Router();

comparisonRouter.get(
  "/history",
  authenticate(),
  validateQuery(comparisonHistoryListQuerySchema),
  asyncHandler(comparisonController.listMine),
);
comparisonRouter.post(
  "/history",
  authenticate(),
  validateBody(comparisonCreateBodySchema),
  asyncHandler(comparisonController.create),
);
