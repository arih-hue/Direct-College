import { env } from "../config/env.js";

export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

export function trackServerEvent(event: AnalyticsEvent): void {
  if (env.NODE_ENV !== "production") {
    console.debug("[analytics]", event.name, event.properties ?? {});
  }
}
