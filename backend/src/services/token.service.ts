import type { StringValue } from "ms";
import type { UserRole } from "@prisma/client";
import jwt, { type SignOptions } from "jsonwebtoken";
import ms from "ms";

import { env } from "../config/env.js";
import type { AccessTokenPayload } from "../types/jwt.js";

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as StringValue,
    subject: payload.sub,
    issuer: "direct-college-api",
    audience: "direct-college-clients",
  };
  return jwt.sign({ email: payload.email, role: payload.role }, env.JWT_ACCESS_SECRET, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
    issuer: "direct-college-api",
    audience: "direct-college-clients",
  });
  if (typeof decoded === "string") {
    throw new Error("Unexpected JWT string payload");
  }
  const { sub, email, role } = decoded as jwt.JwtPayload & {
    email?: string;
    role?: UserRole;
  };
  if (!sub || !email || !role) {
    throw new Error("Invalid access token payload");
  }
  return { sub, email, role };
}

export function getRefreshTtlMs(): number {
  const value = ms(env.JWT_REFRESH_EXPIRES_IN as StringValue);
  if (typeof value !== "number") {
    throw new Error("JWT_REFRESH_EXPIRES_IN must resolve to a finite duration");
  }
  return value;
}
