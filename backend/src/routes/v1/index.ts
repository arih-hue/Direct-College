import { Router } from "express";

import { env } from "../../config/env.js";
import { analyticsRouter } from "../../modules/analytics/index.js";
import { authRouter } from "../../modules/auth/index.js";
import { branchRouter } from "../../modules/branches/index.js";
import { collegeRouter } from "../../modules/colleges/index.js";
import { comparisonRouter } from "../../modules/comparisons/index.js";
import { counselingRouter } from "../../modules/counseling/index.js";
import { cutoffRouter } from "../../modules/cutoffs/index.js";
import { ingestionRouter } from "../../modules/ingestion/index.js";
import { mlRouter } from "../../modules/ml/index.js";
import { mentorRouter } from "../../modules/mentors/index.js";
import { placementRouter } from "../../modules/placements/index.js";
import { predictorRouter } from "../../modules/predictor/index.js";
import { reviewRouter } from "../../modules/reviews/index.js";
import { scrapingRouter } from "../../modules/scraping/index.js";
import { adminRouter } from "../../modules/admin/index.js";
import { seoRouter } from "../../modules/seo/index.js";
import { usersRouter } from "../../modules/users/index.js";

export const v1Router = Router();

v1Router.get("/health", (_req, res) => {
  res.json({ success: true, data: { version: env.API_VERSION } });
});

v1Router.use("/auth", authRouter);
v1Router.use("/users", usersRouter);

v1Router.use("/colleges", collegeRouter);
v1Router.use("/branches", branchRouter);
v1Router.use("/cutoffs", cutoffRouter);
v1Router.use("/placements", placementRouter);
v1Router.use("/reviews", reviewRouter);
v1Router.use("/comparisons", comparisonRouter);
v1Router.use("/mentors", mentorRouter);
v1Router.use("/counseling-strategies", counselingRouter);
v1Router.use("/analytics", analyticsRouter);
v1Router.use("/ml", mlRouter);
v1Router.use("/predictor", predictorRouter);
v1Router.use("/scraping", scrapingRouter);
v1Router.use("/ingestion", ingestionRouter);
v1Router.use("/admin", adminRouter);
v1Router.use("/seo", seoRouter);
