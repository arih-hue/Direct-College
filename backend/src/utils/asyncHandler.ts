import type { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => unknown,
): RequestHandler => {
  return (req, res, next) => {
    void Promise.resolve(fn(req, res, next)).catch(next);
  };
};
