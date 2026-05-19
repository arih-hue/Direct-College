import "dotenv/config";

import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";
import { getRedis } from "./config/redis.js";

import { logger } from "./utils/logger.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info("API listening", { port: env.PORT, env: env.NODE_ENV });
});

async function shutdown(signal: string) {
  logger.info("Shutting down", { signal });
  server.close(() => {
    console.log("HTTP server closed");
  });
  await prisma.$disconnect();
  const redis = getRedis();
  if (redis) {
    try {
      await redis.quit();
    } catch {
      redis.disconnect();
    }
  }
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
