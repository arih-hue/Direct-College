import { readFile } from "node:fs/promises";

import type { IngestionFileFormat } from "@prisma/client";
import type { Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";
import { fingerprintRecord } from "../government-data/dedupe.js";
import { normalizeRows } from "../government-data/normalize.js";
import { validateCollegeRow, validateRowShape } from "../government-data/validate.js";
import { mapCollegeRow } from "../government-data/mapping/collegeMapping.js";
import { parseByFormat } from "../parsers/index.js";
import { ingestionJobRepository } from "../repositories/ingestionJob.repository.js";

async function loadBuffer(sourceUri: string): Promise<Buffer> {
  if (sourceUri.startsWith("http://") || sourceUri.startsWith("https://")) {
    const res = await fetch(sourceUri, { signal: AbortSignal.timeout(120_000) });
    if (!res.ok) {
      throw new Error(`Download failed: ${String(res.status)}`);
    }
    return Buffer.from(await res.arrayBuffer());
  }
  const path = sourceUri.startsWith("file://") ? sourceUri.slice("file://".length) : sourceUri;
  return readFile(path);
}

export type IngestionOptions = {
  entityType?: string;
};

/**
 * Full pipeline: fetch → parse → normalize → validate → dedupe fingerprints → persist staged rows → snapshot `GovernmentDataset`.
 */
export async function runIngestionPipeline(
  ingestionJobId: string,
  format: IngestionFileFormat,
  sourceUri: string,
  agency: string,
  options: IngestionOptions = {},
): Promise<{ staged: number }> {
  const entityType = options.entityType ?? "generic";

  await ingestionJobRepository.updateStatus(ingestionJobId, {
    status: "RUNNING",
    startedAt: new Date(),
    errorMessage: null,
  });

  const buf = await loadBuffer(sourceUri);
  const rawRows = await parseByFormat(format, buf);
  const normalized = normalizeRows(rawRows);

  const staged: Array<{
    fingerprint: string;
    entityType: string;
    normalized: Prisma.InputJsonValue;
    validationErrors?: Prisma.InputJsonValue;
    mappedCollegeId?: string | null;
  }> = [];

  for (const row of normalized) {
    const shape = validateRowShape(row);
    if (!shape.ok) {
      const fp = fingerprintRecord(entityType, row);
      staged.push({
        fingerprint: fp,
        entityType,
        normalized: row,
        validationErrors: shape.errors,
      });
      continue;
    }

    let validated = row;
    let validationErrors: string[] | undefined;

    if (entityType === "college") {
      const collegeVal = validateCollegeRow(row);
      if (!collegeVal.ok) {
        validationErrors = collegeVal.errors;
      } else {
        validated = collegeVal.data;
      }
    }

    const fp = fingerprintRecord(entityType, validated);
    const mappedCollegeId =
      entityType === "college" && !validationErrors ? await mapCollegeRow(validated) : null;

    staged.push({
      fingerprint: fp,
      entityType,
      normalized: validated,
      ...(validationErrors ? { validationErrors } : {}),
      mappedCollegeId,
    });
  }

  const result = await ingestionJobRepository.bulkCreateStagedRows(ingestionJobId, staged);

  await prisma.governmentDataset.upsert({
    where: {
      agency_externalId: { agency, externalId: ingestionJobId },
    },
    create: {
      agency,
      externalId: ingestionJobId,
      title: `Ingestion job ${ingestionJobId}`,
      lastSyncedAt: new Date(),
      snapshot: { stagedCount: staged.length, inserted: result.count } as Prisma.InputJsonValue,
    },
    update: {
      lastSyncedAt: new Date(),
      snapshot: { stagedCount: staged.length, inserted: result.count } as Prisma.InputJsonValue,
    },
  });

  await ingestionJobRepository.updateStatus(ingestionJobId, {
    status: "COMPLETED",
    recordCount: result.count,
    completedAt: new Date(),
    errorMessage: null,
  });

  return { staged: result.count };
}
