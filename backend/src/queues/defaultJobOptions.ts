import type { DefaultJobOptions } from "bullmq";

export const defaultJobOptions: DefaultJobOptions = {
  attempts: 5,
  backoff: {
    type: "exponential",
    delay: 3000,
  },
  removeOnComplete: { count: 500 },
  removeOnFail: { count: 200 },
};
