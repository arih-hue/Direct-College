import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
});

export function parseXmlBuffer(buf: Buffer): unknown {
  const text = buf.toString("utf8");
  return parser.parse(text) as unknown;
}
