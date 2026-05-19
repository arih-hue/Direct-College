import type { Request, Response } from "express";

import { analyticsService } from "../services/analytics.service.js";
import { enqueueAnalyticsJob } from "../queues/producers.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOk } from "../utils/apiResponse.js";
import type {
  AnalyticsDaysQuery,
  AnalyticsEventBody,
  AnalyticsSummaryQuery,
  ComparisonTrendsQuery,
  PopularCollegesQuery,
} from "../modules/analytics/analytics.schemas.js";

export const analyticsController = {
  ingest: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as AnalyticsEventBody;
    await analyticsService.recordEvent({
      name: body.name,
      ...(body.properties !== undefined ? { properties: body.properties } : {}),
      ...(req.auth?.userId !== undefined ? { userId: req.auth.userId } : {}),
    });
    try {
      await enqueueAnalyticsJob({
        event: body.name,
        properties: body.properties,
      });
    } catch {
      /* Redis queue optional */
    }
    sendOk(res, { ok: true });
  }),

  summary: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AnalyticsSummaryQuery;
    sendOk(res, await analyticsService.summary(query));
  }),

  popularColleges: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as PopularCollegesQuery;
    sendOk(res, await analyticsService.popularColleges(query));
  }),

  predictions: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AnalyticsDaysQuery;
    sendOk(res, await analyticsService.predictionAnalytics(query.days));
  }),

  engagement: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AnalyticsDaysQuery;
    sendOk(res, await analyticsService.engagementMetrics(query.days));
  }),

  comparisonTrends: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as ComparisonTrendsQuery;
    sendOk(res, await analyticsService.comparisonTrends(query.limit));
  }),
};
