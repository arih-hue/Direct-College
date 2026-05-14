import type { Response } from "express";

export type PaginatedPayload<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function sendOk(res: Response, data: unknown, statusCode = 200): void {
  res.status(statusCode).json({ success: true, data });
}

export function sendPaginated(
  res: Response,
  payload: Omit<PaginatedPayload<unknown>, "totalPages"> & { total: number },
): void {
  const totalPages = Math.max(1, Math.ceil(payload.total / payload.pageSize));
  const body: PaginatedPayload<unknown> = {
    items: payload.items,
    page: payload.page,
    pageSize: payload.pageSize,
    total: payload.total,
    totalPages,
  };
  res.json({ success: true, data: body });
}
