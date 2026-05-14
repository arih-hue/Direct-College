import { OAuth2Client } from "google-auth-library";
import type { User, UserRole } from "@prisma/client";

import { env } from "../config/env.js";
import { refreshTokenRepository } from "../repositories/refreshToken.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { getRefreshTtlMs, signAccessToken } from "../services/token.service.js";
import { AppError } from "../utils/errors.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { generateRefreshToken } from "../utils/tokens.js";

export type AuthUserView = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  emailVerified: boolean;
};

function toView(user: User): AuthUserView {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerified,
  };
}

async function issueSession(user: User): Promise<{ accessToken: string; refreshToken: string; user: AuthUserView }> {
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + getRefreshTtlMs());
  await refreshTokenRepository.create(user.id, refreshToken, expiresAt);
  return { accessToken, refreshToken, user: toView(user) };
}

export const authService = {
  async register(input: { email: string; password: string; name?: string }) {
    const email = input.email.toLowerCase();
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError(409, "EMAIL_IN_USE", "An account with this email already exists.");
    }
    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      email,
      passwordHash,
      role: "USER",
      ...(input.name !== undefined ? { name: input.name } : {}),
    });
    return issueSession(user);
  },

  async login(input: { email: string; password: string }) {
    const email = input.email.toLowerCase();
    const user = await userRepository.findByEmail(email);
    if (!user?.passwordHash) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    }
    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    }
    return issueSession(user);
  },

  async refresh(rawRefreshToken: string | undefined) {
    if (!rawRefreshToken) {
      throw new AppError(401, "REFRESH_MISSING", "Refresh token is required.");
    }
    const existing = await refreshTokenRepository.findValidByRaw(rawRefreshToken);
    if (!existing) {
      throw new AppError(401, "REFRESH_INVALID", "Refresh token is invalid or expired.");
    }
    await refreshTokenRepository.revokeByRaw(rawRefreshToken);
    return issueSession(existing.user);
  },

  async logout(rawRefreshToken: string | undefined) {
    if (!rawRefreshToken) return;
    await refreshTokenRepository.revokeByRaw(rawRefreshToken);
  },

  async logoutAll(userId: string) {
    await refreshTokenRepository.revokeAllForUser(userId);
  },

  async googleSignIn(idToken: string) {
    if (!env.GOOGLE_CLIENT_ID) {
      throw new AppError(500, "GOOGLE_NOT_CONFIGURED", "Google sign-in is not configured on the server.");
    }
    const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw new AppError(401, "GOOGLE_INVALID", "Google token could not be verified.");
    }
    const googleId = payload.sub;
    const email = payload.email.toLowerCase();

    const byGoogle = await userRepository.findByGoogleId(googleId);
    if (byGoogle) {
      return issueSession(byGoogle);
    }

    const byEmail = await userRepository.findByEmail(email);
    if (byEmail) {
      const linked = await userRepository.update(byEmail.id, {
        googleId,
        emailVerified: payload.email_verified ?? byEmail.emailVerified,
        avatarUrl: payload.picture ?? byEmail.avatarUrl,
        name: byEmail.name ?? payload.name ?? null,
      });
      return issueSession(linked);
    }

    const created = await userRepository.create({
      email,
      googleId,
      name: payload.name ?? null,
      avatarUrl: payload.picture ?? null,
      emailVerified: Boolean(payload.email_verified),
      role: "USER",
    });
    return issueSession(created);
  },
};
