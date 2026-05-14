export function parseJsonBuffer(buf: Buffer): unknown {
  const text = buf.toString("utf8");
  return JSON.parse(text) as unknown;
}
