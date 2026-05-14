import { Router } from "express";

import { userController } from "../../controllers/user.controller.js";
import { authenticate } from "../../middlewares/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const usersRouter = Router();

usersRouter.get("/me", authenticate(), asyncHandler(userController.me));
