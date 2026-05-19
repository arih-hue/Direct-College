import type { Request, Response } from "express";

import { seoService } from "../services/seo.service.js";
import { AppError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOk } from "../utils/apiResponse.js";
import type { SeoDynamicPagesQuery, SeoSlugBody } from "../modules/seo/seo.schemas.js";

export const seoController = {
  sitemap: asyncHandler(async (_req: Request, res: Response) => {
    sendOk(res, await seoService.sitemap());
  }),

  faq: asyncHandler(async (_req: Request, res: Response) => {
    sendOk(res, seoService.faqSchema());
  }),

  generateSlug: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as SeoSlugBody;
    sendOk(res, { slug: seoService.generateSlug(body.name) });
  }),

  collegeMetadata: asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params["slug"] as string;
    const meta = await seoService.collegeMetadata(slug);
    if (!meta) {
      throw new AppError(404, "NOT_FOUND", "College SEO metadata not found.");
    }
    sendOk(res, meta);
  }),

  dynamicPages: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as SeoDynamicPagesQuery;
    sendOk(res, await seoService.dynamicPages(query.limit));
  }),
};
