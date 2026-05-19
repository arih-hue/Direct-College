import type { ChanceBucket } from "./buckets.js";

export type AdmissionRankingInput = {
  studentRank: number;
  effectiveClosingRank: number;
  bucket: ChanceBucket;
};

/**
 * Normalized 0–100 score: higher means a stronger statistical match to the
 * observed closing rank (lenient closing vs student AIR), with bucket prior.
 * Intended for ordering within SAFE / MODERATE / DREAM lists.
 */
export function computeAdmissionScore(input: AdmissionRankingInput): number {
  const { studentRank, effectiveClosingRank } = input;
  const bucket = input.bucket;
  if (!Number.isFinite(studentRank) || studentRank <= 0) {
    return 0;
  }
  if (!Number.isFinite(effectiveClosingRank) || effectiveClosingRank <= 0) {
    return 0;
  }

  const ratio = effectiveClosingRank / studentRank;
  const ratioComponent = Math.min(70, Math.max(0, (ratio - 0.5) * 70));

  const bucketBoost = bucket === "SAFE" ? 28 : bucket === "MODERATE" ? 18 : 6;
  const raw = ratioComponent + bucketBoost + (ratio >= 1 ? Math.min(12, (ratio - 1) * 40) : 0);

  return Math.round(Math.min(100, Math.max(0, raw)));
}

export function assignPredictionRanks<T extends { admissionScore: number; name: string }>(
  list: T[],
): Array<T & { predictionRank: number }> {
  const sorted = [...list].sort((a, b) => {
    if (b.admissionScore !== a.admissionScore) {
      return b.admissionScore - a.admissionScore;
    }
    return a.name.localeCompare(b.name);
  });
  return sorted.map((row, idx) => ({ ...row, predictionRank: idx + 1 }));
}
