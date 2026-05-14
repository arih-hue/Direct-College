import type { IngestionFileFormat } from "@prisma/client";

import { parseCsvBuffer } from "./parseCsv.js";
import { parseJsonBuffer } from "./parseJson.js";
import { parsePdfBuffer } from "./parsePdf.js";
import { parseXlsxBuffer } from "./parseXlsx.js";
import { parseXmlBuffer } from "./parseXml.js";

export type ParsedRows = Record<string, unknown>[];

function rowsFromUnknown(data: unknown): ParsedRows {
  if (Array.isArray(data)) {
    return data.filter((r): r is Record<string, unknown> => r !== null && typeof r === "object");
  }
  if (data && typeof data === "object") {
    return [data as Record<string, unknown>];
  }
  return [];
}

export async function parseByFormat(format: IngestionFileFormat, buf: Buffer): Promise<ParsedRows> {
  switch (format) {
    case "CSV":
      return parseCsvBuffer(buf) as ParsedRows;
    case "XLSX":
      return parseXlsxBuffer(buf);
    case "JSON":
      return rowsFromUnknown(parseJsonBuffer(buf));
    case "XML":
      return rowsFromUnknown(parseXmlBuffer(buf));
    case "PDF": {
      const { text } = await parsePdfBuffer(buf);
      return [{ rawText: text }];
    }
    default: {
      const _exhaustive: never = format;
      return _exhaustive;
    }
  }
}

export { parseCsvBuffer } from "./parseCsv.js";
export { parseJsonBuffer } from "./parseJson.js";
export { parsePdfBuffer } from "./parsePdf.js";
export { parseXlsxBuffer } from "./parseXlsx.js";
export { parseXmlBuffer } from "./parseXml.js";
