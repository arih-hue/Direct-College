import { prisma } from "../../config/database.js";
import { resolveCollegeId } from "./branchMapping.js";
import { mapBranchRow, upsertBranchForRow } from "./branchMapping.js";

export async function commitCutoffRow(row: Record<string, unknown>): Promise<boolean> {
  const collegeId = await resolveCollegeId(row);
  if (!collegeId) return false;

  let branchId = await mapBranchRow(row, collegeId);
  if (!branchId) {
    branchId = await upsertBranchForRow(row, collegeId);
  }

  const year = Number(row["year"]);
  const category = String(row["category"]);
  const exam = typeof row["exam"] === "string" ? row["exam"] : "JEE Main";
  const round = typeof row["round"] === "string" ? row["round"] : null;
  const openingRank = row["opening_rank"] != null ? Number(row["opening_rank"]) : null;
  const closingRank = row["closing_rank"] != null ? Number(row["closing_rank"]) : null;

  const existing = await prisma.cutoff.findFirst({
    where: { collegeId, branchId, year, category, exam, round },
    select: { id: true },
  });
  if (existing) {
    await prisma.cutoff.update({
      where: { id: existing.id },
      data: {
        openingRank,
        closingRank,
      },
    });
  } else {
    await prisma.cutoff.create({
      data: {
        collegeId,
        branchId,
        year,
        category,
        exam,
        round,
        openingRank,
        closingRank,
      },
    });
  }
  return true;
}
