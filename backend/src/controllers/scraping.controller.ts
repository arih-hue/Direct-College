import type { Request, Response } from "express";

import { scrapingService } from "../services/scraping.service.js";
import { AppError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOk, sendPaginated } from "../utils/apiResponse.js";
import type { ScrapeJobListQuery, ScrapeLogsQuery, TriggerScrapeBody } from "../modules/scraping/scraping.schemas.js";

export const scrapingController = {
  trigger: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as TriggerScrapeBody;
    const out = await scrapingService.trigger(body);
    sendOk(res, out, 202);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as ScrapeJobListQuery;
    const { items, total } = await scrapingService.list(query);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const job = await scrapingService.getById(req.params["id"] as string);
    if (!job) {
      throw new AppError(404, "NOT_FOUND", "Scrape job not found.");
    }
    sendOk(res, job);
  }),

  logs: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as ScrapeLogsQuery;
    const scrapeJobId = req.params["id"] as string;
    const { items, total } = await scrapingService.logs(scrapeJobId, query);
    sendPaginated(res, { items, total, page: query.page, pageSize: query.pageSize });
  }),
};
