/**
 * PDF text extraction — requires `pdf-parse` (may need extra system deps in Docker).
 */
export async function parsePdfBuffer(buf: Buffer): Promise<{ text: string; numpages?: number }> {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buf);
  return { text: data.text, numpages: data.numpages };
}
