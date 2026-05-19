import type { Job } from "bullmq";

import { prisma } from "../../config/database.js";
import type { IngestionJobPayload } from "../../queues/producers.js";
import { ingestionJobRepository } from "../../repositories/ingestionJob.repository.js";
import { runIngestionPipeline } from "../../ingestion-pipeline/runIngestion.js";

export async function processIngestionJob(job: Job<IngestionJobPayload>): Promise<void> {
  const { ingestionJobId } = job.data;
  const row = await prisma.ingestionJob.findUnique({ where: { id: ingestionJobId } });
  if (!row) {
    throw new Error(`IngestionJob not found: ${ingestionJobId}`);
  }

  const meta = row.metadata as { entityType?: string; commit?: boolean } | null;

  try {
    await runIngestionPipeline(ingestionJobId, row.format, row.sourceUri, row.agency, {
      entityType: meta?.entityType,
      commit: meta?.commit ?? false,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await ingestionJobRepository.updateStatus(ingestionJobId, {
      status: "FAILED",
      errorMessage: msg,
      completedAt: new Date(),
    });
    throw err;
  }
}
