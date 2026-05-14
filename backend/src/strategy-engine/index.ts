/**
 * Counseling / JoSAA strategy rules engine (placeholder).
 * Future: integrate policy tables + `strategy-engine` Python service via `mlGateway`.
 */
export type StrategyInput = {
  rank: number;
  category: string;
  preferences: string[];
};

export function buildStrategyHints(_input: StrategyInput): Promise<string[]> {
  return Promise.resolve([
    "Fill real choices in order of preference; verify eligibility for special rounds.",
    "Keep buffer choices across SAFE/MODERATE bands produced by the predictor.",
  ]);
}
