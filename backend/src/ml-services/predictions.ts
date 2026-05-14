export type AdmissionStubResult = {
  score: number;
  features: string[];
  notes: string;
};

export function runAdmissionStub(input: Record<string, unknown>): AdmissionStubResult {
  const features = Object.keys(input).slice(0, 24);
  const score = Math.min(0.99, 0.15 + features.length * 0.02);
  return {
    score,
    features,
    notes: "Stub inference. Replace with your hosted model or batch scoring pipeline.",
  };
}

/** @deprecated Use `runAdmissionStub` */
export function scoreAdmissionChance(input: unknown): Promise<{ score: number }> {
  const r = runAdmissionStub(input as Record<string, unknown>);
  return Promise.resolve({ score: r.score });
}
