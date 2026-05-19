import { env } from "../config/env.js";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

function emit(level: LogLevel, message: string, payload?: LogPayload): void {
  if (level === "debug" && env.NODE_ENV === "production") {
    return;
  }
  const entry = {
    ts: new Date().toISOString(),
    level,
    msg: message,
    env: env.NODE_ENV,
    ...(payload ?? {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug: (message: string, payload?: LogPayload) => emit("debug", message, payload),
  info: (message: string, payload?: LogPayload) => emit("info", message, payload),
  warn: (message: string, payload?: LogPayload) => emit("warn", message, payload),
  error: (message: string, payload?: LogPayload) => emit("error", message, payload),
};
