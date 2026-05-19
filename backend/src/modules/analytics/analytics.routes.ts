import { Router } from "express";

import { analyticsController } from "../../controllers/analytics.controller.js";
import { optionalAuthenticate } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/validateRequest.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  analyticsDaysQuerySchema,
  analyticsEventBodySchema,
  analyticsSummaryQuerySchema,
  comparisonTrendsQuerySchema,
  popularCollegesQuerySchema,
} from "./analytics.schemas.js";

export const analyticsRouter = Router();

analyticsRouter.post(
  "/events",
  optionalAuthenticate(),
  validateBody(analyticsEventBodySchema),
  asyncHandler(analyticsController.ingest),
);
analyticsRouter.get(
  "/summary",
  validateQuery(analyticsSummaryQuerySchema),
  asyncHandler(analyticsController.summary),
);
analyticsRouter.get(
  "/popular-colleges",
  validateQuery(popularCollegesQuerySchema),
  asyncHandler(analyticsController.popularColleges),
);
analyticsRouter.get(
  "/predictions",
  validateQuery(analyticsDaysQuerySchema),
  asyncHandler(analyticsController.predictions),
);
analyticsRouter.get(
  "/engagement",
  validateQuery(analyticsDaysQuerySchema),
  asyncHandler(analyticsController.engagement),
);
analyticsRouter.get(
  "/comparisons/trends",
  validateQuery(comparisonTrendsQuerySchema),
  asyncHandler(analyticsController.comparisonTrends),
);
