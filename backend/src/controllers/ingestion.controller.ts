import type { Request, Response } from "express";

import { ingestionService } from "../services/ingestion.service.js";
import { AppError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOk, sendPaginated } from "../utils/apiResponse.js";
import type {
  CommitIngestionBody,
  GovSyncBody,
  IngestionJobListQuery,
  TriggerIngestionBody,
} from "../modules/ingestion/ingestion.schemas.js";

export const ingestionController = {
  trigger: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as TriggerIngestionBody;
    const out = await ingestionService.trigger(body);
    sendOk(res, out, 202);
  }),

  syncGov: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as GovSyncBody;
    const out = await ingestionService.syncGov(body);
    sendOk(res, out, 202);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as IngestionJobListQuery;
    const { items, total } = await ingestionService.list(query);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const job = await ingestionService.getById(req.params["id"] as string);
    if (!job) {
      throw new AppError(404, "NOT_FOUND", "Ingestion job not found.");
    }
    sendOk(res, job);
  }),

  commit: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as CommitIngestionBody;
    const out = await ingestionService.commit(body);
    if (!out) {
      throw new AppError(404, "NOT_FOUND", "Ingestion job not found.");
    }
    sendOk(res, out);
  }),

  listDatasets: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as IngestionJobListQuery;
    const { items, total } = await ingestionService.listDatasets(query);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),
};
