"use client";

import { useCallback, useState } from "react";

import type { AsyncStatus } from "./use-api-query";

export function useApiMutation<TArgs, TResult>(mutationFn: (args: TArgs) => Promise<TResult>) {
  const [data, setData] = useState<TResult | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [error, setError] = useState<unknown>(null);

  const mutateAsync = useCallback(
    async (args: TArgs) => {
      setStatus("loading");
      setError(null);
      try {
        const result = await mutationFn(args);
        setData(result);
        setStatus("success");
        return result;
      } catch (e) {
        setError(e);
        setStatus("error");
        throw e;
      }
    },
    [mutationFn],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setData(null);
  }, []);

  return {
    mutateAsync,
    data,
    status,
    loading: status === "loading",
    error,
    reset,
    isSuccess: status === "success",
    isError: status === "error",
  };
}
