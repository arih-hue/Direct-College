/**
 * Queue producers (BullMQ, Cloud Tasks, etc.). Keep Redis connection in `src/config/redis.ts`.
 */
export async function registerDefaultQueues(): Promise<void> {
  await Promise.resolve();
}
