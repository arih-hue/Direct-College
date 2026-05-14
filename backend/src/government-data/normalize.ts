/**
 * Normalization: stable keys, trimmed strings, lowercase snake_case field names.
 */
export function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    const key = k
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
    if (!key) continue;
    if (typeof v === "string") {
      const t = v.trim();
      out[key] = t === "" ? null : t;
    } else {
      out[key] = v;
    }
  }
  return out;
}

export function normalizeRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map((r) => normalizeRow(r));
}
