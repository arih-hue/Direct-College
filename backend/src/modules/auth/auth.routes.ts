import { Router } from "express";

import { authController } from "../../controllers/auth.controller.js";
import { authenticate, requireRoles } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/validateRequest.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { googleBodySchema, loginBodySchema, registerBodySchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(registerBodySchema),
  asyncHandler(authController.register),
);
authRouter.post("/login", validateBody(loginBodySchema), asyncHandler(authController.login));
authRouter.post("/google", validateBody(googleBodySchema), asyncHandler(authController.google));
authRouter.post("/refresh", asyncHandler(authController.refresh));
authRouter.post("/logout", asyncHandler(authController.logout));
authRouter.post(
  "/logout-all",
  authenticate(),
  asyncHandler(authController.logoutAll),
);

/** Example admin-only surface — extend with real admin controllers. */
authRouter.get(
  "/admin/ping",
  authenticate(),
  requireRoles("ADMIN"),
  (_req, res) => {
    res.json({ success: true, data: { ok: true } });
  },
);
