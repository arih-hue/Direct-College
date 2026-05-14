import { prisma } from "../../config/database.js";

/**
 * Resolve `mappedCollegeId` from normalized row — extend with fuzzy matching / external IDs.
 */
export async function mapCollegeRow(row: Record<string, unknown>): Promise<string | null> {
  const slug = typeof row["slug"] === "string" ? row["slug"] : null;
  if (slug) {
    const bySlug = await prisma.college.findUnique({ where: { slug }, select: { id: true } });
    if (bySlug) return bySlug.id;
  }
  const name = typeof row["name"] === "string" ? row["name"] : null;
  if (name) {
    const byName = await prisma.college.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      select: { id: true },
    });
    if (byName) return byName.id;
  }
  return null;
}
