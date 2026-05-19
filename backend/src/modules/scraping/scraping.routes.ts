import { Router } from "express";

import { scrapingController } from "../../controllers/scraping.controller.js";
import { authenticate, requireRoles } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/validateRequest.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  scrapeJobListQuerySchema,
  scrapeLogsQuerySchema,
  triggerScrapeBodySchema,
} from "./scraping.schemas.js";

export const scrapingRouter = Router();

scrapingRouter.use(authenticate(), requireRoles("ADMIN"));

scrapingRouter.post(
  "/jobs",
  validateBody(triggerScrapeBodySchema),
  asyncHandler(scrapingController.trigger),
);
scrapingRouter.get(
  "/jobs",
  validateQuery(scrapeJobListQuerySchema),
  asyncHandler(scrapingController.list),
);
scrapingRouter.get("/jobs/:id", asyncHandler(scrapingController.getById));
scrapingRouter.get(
  "/jobs/:id/logs",
  validateQuery(scrapeLogsQuerySchema),
  asyncHandler(scrapingController.logs),
);
