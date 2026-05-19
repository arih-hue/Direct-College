import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env, getCorsOrigins } from "./config/env.js";
import { prisma } from "./config/database.js";
import { pingRedis } from "./config/redis.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFound.js";
import { requestIdMiddleware } from "./middlewares/requestId.js";
import { v1Router } from "./routes/v1/index.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { logger } from "./utils/logger.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(requestIdMiddleware());
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const origins = getCorsOrigins();
  app.use(
    cors({
      origin: origins === true ? true : origins,
      credentials: true,
    }),
  );

  morgan.token("request-id", (req) => (req as express.Request).requestId ?? "-");
  app.use(
    morgan(env.NODE_ENV === "production" ? ":request-id :remote-addr :method :url :status :res[content-length] - :response-time ms" : "dev"),
  );

  app.get("/health/live", (_req, res) => {
    res.json({ success: true, data: { status: "alive" } });
  });

  app.get(
    "/health/ready",
    asyncHandler(async (_req, res) => {
      await prisma.$queryRaw`SELECT 1`;
      const redis = await pingRedis();
      res.json({
        success: true,
        data: {
          status: "ready",
          db: "ok",
          redis,
          version: env.API_VERSION,
        },
      });
    }),
  );

  app.get(
    "/health",
    asyncHandler(async (_req, res) => {
      await prisma.$queryRaw`SELECT 1`;
      const redis = await pingRedis();
      res.json({
        success: true,
        data: {
          status: "ok",
          db: "ok",
          redis,
          version: env.API_VERSION,
          env: env.NODE_ENV,
        },
      });
    }),
  );

  app.use(`/api/${env.API_VERSION}`, v1Router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  logger.info("Express app configured", { env: env.NODE_ENV, apiVersion: env.API_VERSION });

  return app;
}
