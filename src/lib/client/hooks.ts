import { useCallback, useEffect, useState } from "react";

export function usePromise<T>(future?: Promise<T> | null) {
  const [data, setData] = useState<T | null | undefined>();
  const [loading, setLoading] = useState<typeof future>();
  const setPromise: typeof setLoading = useCallback(
    (...params) => setLoading(...params),
    [setLoading]
  );
  useEffect(() => {
    setLoading(() => future);
  }, [future]);

  useEffect(() => {
    if (!loading) return;
    let abort = false;
    loading
      .then((result) => {
        setData(() => result);
      })
      .finally(() => {
        if (abort) return;
        setLoading(() => undefined);
      });
    return () => {
      abort = true;
    };
  }, [loading]);

  return {
    data,
    loading: !!loading,
    setPromise,
  };
}
