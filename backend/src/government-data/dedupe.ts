import { createHash } from "node:crypto";

/**
 * Stable fingerprint for deduplication within an ingestion batch (and across runs if keys are comparable).
 */
export function fingerprintRecord(entityType: string, row: Record<string, unknown>): string {
  const keys = Object.keys(row).sort();
  const stable: Record<string, unknown> = {};
  for (const k of keys) {
    stable[k] = row[k];
  }
  const payload = JSON.stringify({ entityType, stable });
  return createHash("sha256").update(payload).digest("hex");
}
