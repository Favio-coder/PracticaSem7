import { useEffect, useState } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      return undefined;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        if (!cancelled && !controller.signal.aborted) {
          setData(result);
        }
      } catch (fetchError) {
        if (cancelled || controller.signal.aborted) {
          return;
        }
        setError(fetchError instanceof Error ? fetchError.message : String(fetchError));
      } finally {
        if (!cancelled && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url]);

  return {
    data: url ? data : null,
    loading: url ? loading : false,
    error: url ? error : null,
  };
}
