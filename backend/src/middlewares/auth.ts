import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";

import { verifyAccessToken } from "../services/token.service.js";
import { AppError } from "../utils/errors.js";

export function authenticate() {
  return (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;
    if (!token) {
      next(new AppError(401, "UNAUTHORIZED", "Missing bearer token."));
      return;
    }
    try {
      const payload = verifyAccessToken(token);
      req.auth = { userId: payload.sub, email: payload.email, role: payload.role };
      next();
    } catch {
      next(new AppError(401, "INVALID_TOKEN", "Access token is invalid or expired."));
    }
  };
}

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      next(new AppError(401, "UNAUTHORIZED", "Not authenticated."));
      return;
    }
    if (!roles.includes(req.auth.role)) {
      next(new AppError(403, "FORBIDDEN", "Insufficient permissions."));
      return;
    }
    next();
  };
}

export function optionalAuthenticate() {
  return (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;
    if (!token) {
      next();
      return;
    }
    try {
      const payload = verifyAccessToken(token);
      req.auth = { userId: payload.sub, email: payload.email, role: payload.role };
    } catch {
      // ignore invalid/expired tokens for optional routes
    }
    next();
  };
}
