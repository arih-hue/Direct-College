import { apiClient } from "../client";
import type { PaginatedData } from "../types";
import { unwrapData } from "../unwrap";

export type JeeCollegePrediction = {
  collegeId: string;
  name: string;
  slug: string;
  state: string | null;
  bestClosingRank: number;
  effectiveClosingRank: number;
  bucket: "SAFE" | "MODERATE" | "DREAM";
  admissionScore: number;
  predictionRank: number;
};

export type JeePredictResponse = {
  SAFE: JeeCollegePrediction[];
  MODERATE: JeeCollegePrediction[];
  DREAM: JeeCollegePrediction[];
  meta: {
    year: number;
    category: string;
    studentRank: number;
    totalCollegesEvaluated: number;
    fromCache: boolean;
    mlServiceHit: boolean;
    mlEnrichment?: unknown;
  };
};

export type PredictionRecord = Record<string, unknown>;

export async function runJeePredictor(payload: {
  rank: number;
  category: string;
  gender: string;
  state: string;
  branchPreferences: string[];
  year?: number;
}) {
  const res = await apiClient.post<unknown>("/predictor", payload);
  return unwrapData<JeePredictResponse>(res.data);
}

export async function listPredictorHistory(params: Record<string, number | undefined> = {}) {
  const res = await apiClient.get<unknown>("/predictor/history", { params });
  return unwrapData<PaginatedData<PredictionRecord>>(res.data);
}
