import type { Job } from "bullmq";

import { mlGatewayPost } from "../../ml-services/mlGateway.js";
import type { MlProcessingPayload } from "../../queues/producers.js";

/**
 * Async ML batch / embedding hooks — proxy to Python service when configured.
 */
export async function processMlJob(job: Job<MlProcessingPayload>): Promise<void> {
  const remote = await mlGatewayPost({
    path: "/queue/ml",
    body: { jobId: job.id, ...job.data },
  });
  if (remote && !remote.ok) {
    throw new Error(`ML upstream returned ${String(remote.status)}`);
  }
}
