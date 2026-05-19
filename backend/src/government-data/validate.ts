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

export const branchRowSchema = z
  .object({
    name: z.string().min(1),
    code: z.string().optional(),
    degree: z.string().optional(),
    college_slug: z.string().optional(),
    college_name: z.string().optional(),
  })
  .passthrough();

export const cutoffRowSchema = z
  .object({
    year: z.coerce.number().int().min(1990).max(2100),
    exam: z.string().min(1).default("JEE Main"),
    category: z.string().min(1),
    closing_rank: z.coerce.number().int().positive().optional(),
    opening_rank: z.coerce.number().int().positive().optional(),
    round: z.string().optional(),
    college_slug: z.string().optional(),
    college_name: z.string().optional(),
    branch_code: z.string().optional(),
    branch_name: z.string().optional(),
  })
  .passthrough();

export const placementRowSchema = z
  .object({
    year: z.coerce.number().int().min(1990).max(2100),
    company: z.string().optional(),
    role: z.string().optional(),
    highest_package: z.coerce.number().optional(),
    average_package: z.coerce.number().optional(),
    median_package: z.coerce.number().optional(),
    offers: z.coerce.number().int().optional(),
    college_slug: z.string().optional(),
    college_name: z.string().optional(),
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

export function validateBranchRow(
  row: Record<string, unknown>,
): { ok: true; data: z.infer<typeof branchRowSchema> } | { ok: false; errors: string[] } {
  const parsed = branchRowSchema.safeParse(row);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`) };
  }
  return { ok: true, data: parsed.data };
}

export function validateCutoffRow(
  row: Record<string, unknown>,
): { ok: true; data: z.infer<typeof cutoffRowSchema> } | { ok: false; errors: string[] } {
  const parsed = cutoffRowSchema.safeParse(row);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`) };
  }
  return { ok: true, data: parsed.data };
}

export function validatePlacementRow(
  row: Record<string, unknown>,
): { ok: true; data: z.infer<typeof placementRowSchema> } | { ok: false; errors: string[] } {
  const parsed = placementRowSchema.safeParse(row);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`) };
  }
  return { ok: true, data: parsed.data };
}
