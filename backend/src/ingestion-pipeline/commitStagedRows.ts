import { Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";
import { mapCollegeRow, upsertCollegeRow } from "../government-data/mapping/collegeMapping.js";
import {
  mapBranchRow,
  resolveCollegeId,
  upsertBranchForRow,
} from "../government-data/mapping/branchMapping.js";
import { commitCutoffRow } from "../government-data/mapping/cutoffMapping.js";

export type CommitResult = {
  committed: number;
  skipped: number;
  byEntity: Record<string, { committed: number; skipped: number }>;
};

const BATCH = 100;

async function commitCollegeRow(row: Record<string, unknown>): Promise<boolean> {
  if (typeof row["name"] !== "string" || row["name"].trim() === "") {
    return false;
  }
  await upsertCollegeRow(row);
  return true;
}

async function commitBranchRow(row: Record<string, unknown>): Promise<boolean> {
  const collegeId = await resolveCollegeId(row);
  if (!collegeId) return false;
  await upsertBranchForRow(row, collegeId);
  return true;
}

async function commitPlacementRow(row: Record<string, unknown>): Promise<boolean> {
  const collegeId = await resolveCollegeId(row);
  if (!collegeId) return false;

  const year = Number(row["year"]);
  if (!Number.isFinite(year)) return false;

  await prisma.placement.create({
    data: {
      collegeId,
      year,
      company: typeof row["company"] === "string" ? row["company"] : undefined,
      role: typeof row["role"] === "string" ? row["role"] : undefined,
      highestPackage: row["highest_package"] != null ? Number(row["highest_package"]) : undefined,
      averagePackage: row["average_package"] != null ? Number(row["average_package"]) : undefined,
      medianPackage: row["median_package"] != null ? Number(row["median_package"]) : undefined,
      offers: row["offers"] != null ? Number(row["offers"]) : undefined,
    },
  });
  return true;
}

async function commitRow(entityType: string, normalized: Prisma.JsonValue): Promise<boolean> {
  if (!normalized || typeof normalized !== "object" || Array.isArray(normalized)) {
    return false;
  }
  const row = normalized as Record<string, unknown>;

  switch (entityType) {
    case "college":
      return commitCollegeRow(row);
    case "branch":
      return commitBranchRow(row);
    case "cutoff":
      return commitCutoffRow(row);
    case "placement":
      return commitPlacementRow(row);
    default:
      return false;
  }
}

/**
 * Promote validated staged rows into domain tables (`College`, `Branch`, `Cutoff`, `Placement`).
 */
export async function commitStagedRows(ingestionJobId: string): Promise<CommitResult> {
  const result: CommitResult = { committed: 0, skipped: 0, byEntity: {} };

  let cursor: string | undefined;
  for (;;) {
    const batch = await prisma.ingestionStagedRow.findMany({
      where: {
        ingestionJobId,
        validationErrors: Prisma.DbNull as any,
      },
      take: BATCH,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: "asc" },
    });
    if (batch.length === 0) break;

    for (const staged of batch) {
      const entity = staged.entityType;
      if (!result.byEntity[entity]) {
        result.byEntity[entity] = { committed: 0, skipped: 0 };
      }

      const ok = await commitRow(entity, staged.normalized);
      if (ok) {
        result.committed += 1;
        result.byEntity[entity].committed += 1;
        if (!staged.mappedCollegeId && entity === "college") {
          const collegeId = await mapCollegeRow(staged.normalized as Record<string, unknown>);
          if (collegeId) {
            await prisma.ingestionStagedRow.update({
              where: { id: staged.id },
              data: { mappedCollegeId: collegeId },
            });
          }
        } else if (!staged.mappedCollegeId && entity !== "college") {
          const collegeId = await resolveCollegeId(staged.normalized as Record<string, unknown>);
          if (collegeId) {
            await prisma.ingestionStagedRow.update({
              where: { id: staged.id },
              data: { mappedCollegeId: collegeId },
            });
          }
        }
      } else {
        result.skipped += 1;
        result.byEntity[entity].skipped += 1;
      }
    }

    cursor = batch[batch.length - 1]?.id;
    if (batch.length < BATCH) break;
  }

  return result;
}

export { mapBranchRow, resolveCollegeId, upsertBranchForRow };
