import type { CookieOptions, Response } from "express";

import { env } from "../config/env.js";
import { getRefreshTtlMs } from "../services/token.service.js";

export const REFRESH_TOKEN_COOKIE = "refresh_token";

export function getRefreshCookieOptions(): CookieOptions {
  const maxAge = getRefreshTtlMs();
  const isProd = env.NODE_ENV === "production";
  const secure = env.COOKIE_SECURE ?? isProd;
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    maxAge,
    path: "/api/v1/auth",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  };
}

export function setRefreshTokenCookie(res: Response, refreshToken: string) {
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, getRefreshCookieOptions());
}

export function clearRefreshTokenCookie(res: Response) {
  const opts = getRefreshCookieOptions();
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    path: opts.path,
    domain: opts.domain,
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
  });
}
