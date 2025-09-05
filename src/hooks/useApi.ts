// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from "react";
import type { UseApiResult, ApiError } from "@/types";

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  dependencies: any[] = []
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const executeRequest = useCallback(async (...args: any[]): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err: any) {
      const apiError: ApiError = {
        message:
          err.response?.data?.message || err.message || "Erro desconhecido",
        status: err.response?.status,
        errors: err.response?.data?.errors,
      };
      setError(apiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (
      dependencies.length === 0 ||
      dependencies.some((dep) => dep !== undefined)
    ) {
      executeRequest();
    }
  }, dependencies);

  const refetch = useCallback((): Promise<T> => {
    return executeRequest();
  }, [executeRequest]);

  return {
    data,
    loading,
    error,
    refetch,
    execute: executeRequest,
  };
}
