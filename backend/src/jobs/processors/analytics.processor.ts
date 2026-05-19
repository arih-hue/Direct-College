import type { Job } from "bullmq";

import { emitEngineEvent } from "../../analytics-engine/index.js";
import type { AnalyticsQueuePayload } from "../../queues/producers.js";

/** Async analytics drain — extend with warehouse export (BigQuery, Datadog, etc.). */
export async function processAnalyticsJob(job: Job<AnalyticsQueuePayload>): Promise<void> {
  emitEngineEvent({
    engine: "analytics-engine",
    name: job.data.event,
    payload: job.data.properties,
  });
}
