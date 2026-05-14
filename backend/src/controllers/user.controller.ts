import type { Request, Response } from "express";

import { userRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userController = {
  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.auth) {
      throw new AppError(401, "UNAUTHORIZED", "Not authenticated.");
    }
    const user = await userRepository.findById(req.auth.userId);
    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found.");
    }
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        avatarUrl: user.avatarUrl,
      },
    });
  }),
};
