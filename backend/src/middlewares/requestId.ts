import { randomUUID } from "node:crypto";

import type { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export function requestIdMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const incoming = req.headers["x-request-id"];
    const id = typeof incoming === "string" && incoming.trim() !== "" ? incoming : randomUUID();
    req.requestId = id;
    res.setHeader("X-Request-Id", id);
    next();
  };
}
