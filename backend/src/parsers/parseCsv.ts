import { parse } from "csv-parse/sync";

export function parseCsvBuffer(buf: Buffer, options?: { columns?: boolean }): Record<string, string>[] {
  const text = buf.toString("utf8");
  const rows = parse(text, {
    columns: options?.columns ?? true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Record<string, string>[];
  return rows;
}
