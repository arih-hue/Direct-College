import "dotenv/config";

import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";
import { getRedis } from "./config/redis.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`API listening on :${String(env.PORT)} (${env.NODE_ENV})`);
});

async function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down…`);
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
