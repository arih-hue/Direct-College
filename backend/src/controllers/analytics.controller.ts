import type { Request, Response } from "express";

import { analyticsService } from "../services/analytics.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOk } from "../utils/apiResponse.js";
import type { AnalyticsEventBody, AnalyticsSummaryQuery } from "../modules/analytics/analytics.schemas.js";

export const analyticsController = {
  ingest: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as AnalyticsEventBody;
    await analyticsService.recordEvent({
      name: body.name,
      ...(body.properties !== undefined ? { properties: body.properties } : {}),
      ...(req.auth?.userId !== undefined ? { userId: req.auth.userId } : {}),
    });
    sendOk(res, { ok: true });
  }),

  summary: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AnalyticsSummaryQuery;
    const data = await analyticsService.summary(query);
    sendOk(res, data);
  }),
};
