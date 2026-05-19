import type { Request, Response } from "express";

import { adminService } from "../services/admin.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOk, sendPaginated } from "../utils/apiResponse.js";
import type {
  AdminCollegeCreateBody,
  AdminCollegeUpdateBody,
  AdminMentorPatchBody,
  AdminPendingReviewsQuery,
  AdminReviewModerateBody,
} from "../modules/admin/admin.schemas.js";
import type { TriggerIngestionBody, TriggerScrapeBody } from "../modules/admin/admin.schemas.js";

export const adminController = {
  dashboard: asyncHandler(async (_req: Request, res: Response) => {
    sendOk(res, await adminService.dashboard());
  }),

  createCollege: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as AdminCollegeCreateBody;
    sendOk(res, await adminService.createCollege(body), 201);
  }),

  updateCollege: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as AdminCollegeUpdateBody;
    sendOk(res, await adminService.updateCollege(req.params["id"] as string, body));
  }),

  deleteCollege: asyncHandler(async (req: Request, res: Response) => {
    sendOk(res, await adminService.deleteCollege(req.params["id"] as string));
  }),

  pendingReviews: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AdminPendingReviewsQuery;
    const { items, total } = await adminService.listPendingReviews(query.page, query.pageSize);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),

  moderateReview: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as AdminReviewModerateBody;
    sendOk(res, await adminService.moderateReview(req.params["id"] as string, body));
  }),

  updateMentor: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as AdminMentorPatchBody;
    sendOk(res, await adminService.updateMentor(req.params["id"] as string, body));
  }),

  triggerScrape: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as TriggerScrapeBody;
    sendOk(res, await adminService.triggerScrape(body), 202);
  }),

  triggerIngestion: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as TriggerIngestionBody;
    sendOk(res, await adminService.triggerIngestion(body), 202);
  }),

  aiMonitoring: asyncHandler(async (_req: Request, res: Response) => {
    sendOk(res, await adminService.aiMonitoring());
  }),
};
