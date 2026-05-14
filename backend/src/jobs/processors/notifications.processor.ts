import type { Job } from "bullmq";

import type { NotificationPayload } from "../../queues/producers.js";

/**
 * Placeholder: SES, FCM, webhooks — implement per channel.
 */
export async function processNotificationJob(job: Job<NotificationPayload>): Promise<void> {
  if (process.env["NODE_ENV"] !== "production") {
    console.info("[notifications]", job.data.template, job.data.to);
  }
}
