import { prisma } from "../../config/database.js";
import { slugify } from "../../utils/slugify.js";
import { mapCollegeRow } from "./collegeMapping.js";

/** Resolve college FK from cutoff/branch/placement normalized rows. */
export async function resolveCollegeId(row: Record<string, unknown>): Promise<string | null> {
  const slug =
    typeof row["college_slug"] === "string"
      ? row["college_slug"]
      : typeof row["slug"] === "string"
        ? row["slug"]
        : null;
  if (slug) {
    return mapCollegeRow({ slug });
  }
  const name =
    typeof row["college_name"] === "string"
      ? row["college_name"]
      : typeof row["name"] === "string" && row["entity"] !== "college"
        ? row["name"]
        : typeof row["name"] === "string" && !row["branch_name"]
          ? row["name"]
          : null;
  if (name) {
    return mapCollegeRow({ name });
  }
  return mapCollegeRow(row);
}

export async function mapBranchRow(
  row: Record<string, unknown>,
  collegeId: string,
): Promise<string | null> {
  const code = typeof row["branch_code"] === "string" ? row["branch_code"] : typeof row["code"] === "string" ? row["code"] : null;
  if (code) {
    const hit = await prisma.branch.findUnique({
      where: { collegeId_code: { collegeId, code } },
      select: { id: true },
    });
    if (hit) return hit.id;
  }
  const name =
    typeof row["branch_name"] === "string"
      ? row["branch_name"]
      : typeof row["name"] === "string"
        ? row["name"]
        : null;
  if (name) {
    const hit = await prisma.branch.findFirst({
      where: { collegeId, name: { equals: name, mode: "insensitive" } },
      select: { id: true },
    });
    if (hit) return hit.id;
  }
  return null;
}

export async function upsertBranchForRow(
  row: Record<string, unknown>,
  collegeId: string,
): Promise<string> {
  const name =
    typeof row["branch_name"] === "string"
      ? row["branch_name"]
      : typeof row["name"] === "string"
        ? row["name"]
        : "Unknown";
  const code =
    typeof row["branch_code"] === "string"
      ? row["branch_code"]
      : typeof row["code"] === "string"
        ? row["code"]
        : slugify(name).slice(0, 32);
  const degree = typeof row["degree"] === "string" ? row["degree"] : undefined;

  const branch = await prisma.branch.upsert({
    where: { collegeId_code: { collegeId, code } },
    create: { collegeId, name, code, degree },
    update: { name, ...(degree ? { degree } : {}) },
    select: { id: true },
  });
  return branch.id;
}
