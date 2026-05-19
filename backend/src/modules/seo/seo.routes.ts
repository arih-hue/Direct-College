import { Router } from "express";

import { seoController } from "../../controllers/seo.controller.js";
import { validateBody } from "../../middlewares/validateRequest.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { seoDynamicPagesQuerySchema, seoSlugBodySchema } from "./seo.schemas.js";

export const seoRouter = Router();

seoRouter.get("/sitemap", asyncHandler(seoController.sitemap));
seoRouter.get("/faq", asyncHandler(seoController.faq));
seoRouter.get("/pages", validateQuery(seoDynamicPagesQuerySchema), asyncHandler(seoController.dynamicPages));
seoRouter.get("/colleges/:slug", asyncHandler(seoController.collegeMetadata));
seoRouter.post("/slug", validateBody(seoSlugBodySchema), asyncHandler(seoController.generateSlug));
