import { Router } from "express";

import { adminController } from "../../controllers/admin.controller.js";
import { analyticsController } from "../../controllers/analytics.controller.js";
import { authenticate, requireRoles } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/validateRequest.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { analyticsSummaryQuerySchema } from "../analytics/analytics.schemas.js";
import {
  adminCollegeCreateBodySchema,
  adminCollegeUpdateBodySchema,
  adminMentorPatchBodySchema,
  adminPendingReviewsQuerySchema,
  adminReviewModerateBodySchema,
  triggerIngestionBodySchema,
  triggerScrapeBodySchema,
} from "./admin.schemas.js";

export const adminRouter = Router();

adminRouter.use(authenticate(), requireRoles("ADMIN"));

adminRouter.get("/dashboard", asyncHandler(adminController.dashboard));
adminRouter.get("/analytics/summary", validateQuery(analyticsSummaryQuerySchema), asyncHandler(analyticsController.summary));
adminRouter.get("/ai/monitoring", asyncHandler(adminController.aiMonitoring));

adminRouter.post("/colleges", validateBody(adminCollegeCreateBodySchema), asyncHandler(adminController.createCollege));
adminRouter.patch("/colleges/:id", validateBody(adminCollegeUpdateBodySchema), asyncHandler(adminController.updateCollege));
adminRouter.delete("/colleges/:id", asyncHandler(adminController.deleteCollege));

adminRouter.get(
  "/reviews/pending",
  validateQuery(adminPendingReviewsQuerySchema),
  asyncHandler(adminController.pendingReviews),
);
adminRouter.post(
  "/reviews/:id/moderate",
  validateBody(adminReviewModerateBodySchema),
  asyncHandler(adminController.moderateReview),
);

adminRouter.patch(
  "/mentors/:id",
  validateBody(adminMentorPatchBodySchema),
  asyncHandler(adminController.updateMentor),
);

adminRouter.post("/scraping/jobs", validateBody(triggerScrapeBodySchema), asyncHandler(adminController.triggerScrape));
adminRouter.post(
  "/ingestion/jobs",
  validateBody(triggerIngestionBodySchema),
  asyncHandler(adminController.triggerIngestion),
);
