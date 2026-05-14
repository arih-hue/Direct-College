import { Router } from "express";

import { collegeController } from "../../controllers/college.controller.js";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { collegeListQuerySchema } from "./college.schemas.js";

export const collegeRouter = Router();

collegeRouter.get("/", validateQuery(collegeListQuerySchema), asyncHandler(collegeController.list));
collegeRouter.get("/:identifier", asyncHandler(collegeController.getByIdentifier));
