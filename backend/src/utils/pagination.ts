export function clampPageSize(pageSize: number, max: number): number {
  return Math.min(Math.max(pageSize, 1), max);
}

export function toSkip(page: number, pageSize: number): number {
  return (Math.max(page, 1) - 1) * pageSize;
}
