import { Router } from "express";

import { ingestionController } from "../../controllers/ingestion.controller.js";
import { authenticate, requireRoles } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/validateRequest.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  commitIngestionBodySchema,
  govSyncBodySchema,
  ingestionJobListQuerySchema,
  triggerIngestionBodySchema,
} from "./ingestion.schemas.js";

export const ingestionRouter = Router();

ingestionRouter.use(authenticate(), requireRoles("ADMIN"));

ingestionRouter.post(
  "/jobs",
  validateBody(triggerIngestionBodySchema),
  asyncHandler(ingestionController.trigger),
);
ingestionRouter.post(
  "/gov-sync",
  validateBody(govSyncBodySchema),
  asyncHandler(ingestionController.syncGov),
);
ingestionRouter.post(
  "/commit",
  validateBody(commitIngestionBodySchema),
  asyncHandler(ingestionController.commit),
);
ingestionRouter.get(
  "/jobs",
  validateQuery(ingestionJobListQuerySchema),
  asyncHandler(ingestionController.list),
);
ingestionRouter.get(
  "/jobs/:id",
  asyncHandler(ingestionController.getById),
);
ingestionRouter.get(
  "/datasets",
  validateQuery(ingestionJobListQuerySchema),
  asyncHandler(ingestionController.listDatasets),
);
