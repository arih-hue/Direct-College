/**
 * Lightweight server-side analytics hooks for ML / predictor flows.
 * Extend with warehouse export or Datadog later.
 */
export type EngineAnalyticsEvent = {
  engine: "predictor" | "recommendation" | "strategy" | "analytics" | "analytics-engine";
  name: string;
  payload?: Record<string, unknown>;
};

export function emitEngineEvent(event: EngineAnalyticsEvent): void {
  if (process.env["NODE_ENV"] !== "production") {
    console.debug(`[analytics-engine] ${event.engine}`, event.name, event.payload ?? {});
  }
}
