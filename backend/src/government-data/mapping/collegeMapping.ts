import { prisma } from "../../config/database.js";
import { slugify } from "../../utils/slugify.js";

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

export async function upsertCollegeRow(row: Record<string, unknown>): Promise<string> {
  const name = String(row["name"]);
  const slug =
    typeof row["slug"] === "string" && row["slug"].trim() !== "" ? row["slug"].trim() : slugify(name);
  const state = typeof row["state"] === "string" ? row["state"] : undefined;
  const city = typeof row["city"] === "string" ? row["city"] : undefined;
  const website = typeof row["website"] === "string" && row["website"] !== "" ? row["website"] : undefined;
  const type = typeof row["type"] === "string" ? row["type"] : undefined;

  const college = await prisma.college.upsert({
    where: { slug },
    create: { name, slug, state, city, website, type },
    update: {
      name,
      ...(state !== undefined ? { state } : {}),
      ...(city !== undefined ? { city } : {}),
      ...(website !== undefined ? { website } : {}),
      ...(type !== undefined ? { type } : {}),
    },
    select: { id: true },
  });
  return college.id;
}
