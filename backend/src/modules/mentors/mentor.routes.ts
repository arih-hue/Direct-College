import { Router } from "express";

import { mentorController } from "../../controllers/mentor.controller.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { mentorListQuerySchema } from "./mentor.schemas.js";

export const mentorRouter = Router();

mentorRouter.get("/", validateQuery(mentorListQuerySchema), asyncHandler(mentorController.list));
mentorRouter.get("/:id", asyncHandler(mentorController.getById));
