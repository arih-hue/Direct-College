import { z } from "zod";

const rowSchema = z.record(z.string(), z.unknown());

/**
 * Structural validation — extend with domain Zod schemas per `entityType`.
 */
export function validateRowShape(row: Record<string, unknown>): { ok: true } | { ok: false; errors: string[] } {
  const parsed = rowSchema.safeParse(row);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.issues.map((e) => e.message) };
  }
  return { ok: true };
}

export const collegeRowSchema = z
  .object({
    name: z.string().min(1),
    slug: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
  })
  .passthrough();

export function validateCollegeRow(
  row: Record<string, unknown>,
): { ok: true; data: z.infer<typeof collegeRowSchema> } | { ok: false; errors: string[] } {
  const parsed = collegeRowSchema.safeParse(row);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`) };
  }
  return { ok: true, data: parsed.data };
}
