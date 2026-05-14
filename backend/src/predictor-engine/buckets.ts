/**
 * JEE rank vs closing-rank bucketing (SAFE / MODERATE / DREAM).
 * Lower AIR is better. `bestClosingRank` is the most lenient closing among matched branches.
 */
export type ChanceBucket = "SAFE" | "MODERATE" | "DREAM";

export type BucketParams = {
  studentRank: number;
  bestClosingRank: number;
  /** Student rank must be <= bestClosing * safeRatio for SAFE */
  safeRatio?: number;
  /** Student rank must be <= bestClosing * moderateRatio for MODERATE (if not SAFE) */
  moderateRatio?: number;
};

const DEFAULT_SAFE = 0.78;
const DEFAULT_MODERATE = 1.02;

export function bucketFromClosing(params: BucketParams): ChanceBucket {
  const { studentRank, bestClosingRank } = params;
  const safeRatio = params.safeRatio ?? DEFAULT_SAFE;
  const moderateRatio = params.moderateRatio ?? DEFAULT_MODERATE;

  if (!Number.isFinite(studentRank) || !Number.isFinite(bestClosingRank) || bestClosingRank <= 0) {
    return "DREAM";
  }

  if (studentRank <= bestClosingRank * safeRatio) {
    return "SAFE";
  }
  if (studentRank <= bestClosingRank * moderateRatio) {
    return "MODERATE";
  }
  return "DREAM";
}

export function applyHomeStateBonus(bestClosing: number, collegeState: string | null, homeState: string): number {
  if (!collegeState || !homeState) return bestClosing;
  if (collegeState.trim().toLowerCase() === homeState.trim().toLowerCase()) {
    return Math.round(bestClosing * 1.05);
  }
  return bestClosing;
}
