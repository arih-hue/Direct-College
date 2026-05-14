"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export function useApiQuery<T>(opts: { queryKey: string; enabled?: boolean; queryFn: () => Promise<T> }) {
  const { queryKey, enabled = true } = opts;
  const fnRef = useRef(opts.queryFn);
  fnRef.current = opts.queryFn;

  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AsyncStatus>(() => (enabled ? "loading" : "idle"));
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const next = await fnRef.current();
      setData(next);
      setStatus("success");
      return next;
    } catch (e) {
      setError(e);
      setStatus("error");
      throw e;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setStatus("idle");
      return;
    }
    void refetch();
  }, [enabled, queryKey, refetch]);

  return {
    data,
    status,
    loading: status === "loading",
    error,
    refetch,
    isSuccess: status === "success",
    isError: status === "error",
  };
}
