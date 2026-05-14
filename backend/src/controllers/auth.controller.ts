import type { Request, Response } from "express";

import { authService } from "../services/auth.service.js";
import { AppError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  clearRefreshTokenCookie,
  REFRESH_TOKEN_COOKIE,
  setRefreshTokenCookie,
} from "../utils/cookies.js";
import type { GoogleBody, LoginBody, RegisterBody } from "../modules/auth/auth.schemas.js";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as RegisterBody;
    const session = await authService.register({
      email: body.email,
      password: body.password,
      ...(typeof body.name === "string" ? { name: body.name } : {}),
    });
    setRefreshTokenCookie(res, session.refreshToken);
    res.status(201).json({
      success: true,
      data: { accessToken: session.accessToken, user: session.user },
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as LoginBody;
    const session = await authService.login(body);
    setRefreshTokenCookie(res, session.refreshToken);
    res.json({ success: true, data: { accessToken: session.accessToken, user: session.user } });
  }),

  google: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as GoogleBody;
    const session = await authService.googleSignIn(body.idToken);
    setRefreshTokenCookie(res, session.refreshToken);
    res.json({ success: true, data: { accessToken: session.accessToken, user: session.user } });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const cookies = req.cookies as Record<string, string | undefined> | undefined;
    const raw = cookies?.[REFRESH_TOKEN_COOKIE];
    const session = await authService.refresh(raw);
    setRefreshTokenCookie(res, session.refreshToken);
    res.json({ success: true, data: { accessToken: session.accessToken, user: session.user } });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const cookies = req.cookies as Record<string, string | undefined> | undefined;
    const raw = cookies?.[REFRESH_TOKEN_COOKIE];
    await authService.logout(raw);
    clearRefreshTokenCookie(res);
    res.status(204).send();
  }),

  logoutAll: asyncHandler(async (req: Request, res: Response) => {
    if (!req.auth) {
      throw new AppError(401, "UNAUTHORIZED", "Not authenticated.");
    }
    await authService.logoutAll(req.auth.userId);
    clearRefreshTokenCookie(res);
    res.status(204).send();
  }),
};
