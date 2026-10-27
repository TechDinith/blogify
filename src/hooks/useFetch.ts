import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(url: string, deps: unknown[] = []): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    axios
      .get<T>(url, { signal: controller.signal })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err: AxiosError) => {
        if (axios.isCancel(err)) return;
        setError(err.message || "Something went wrong");
        setLoading(false);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, tick, ...deps]);

  return { data, loading, error, refetch };
}

export default useFetch;
