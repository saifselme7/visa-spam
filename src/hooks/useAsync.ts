import { useCallback, useEffect, useRef, useState } from 'react';
import type { Result, ServiceError } from '@/types/result';

export interface AsyncState<T> {
  data: T | null;
  error: ServiceError | null;
  loading: boolean;
  /** Re-runs the task. Safe to call from a retry button. */
  reload: () => void;
}

/**
 * Runs a Result-returning service call and tracks loading/error state.
 * Stale responses are discarded when dependencies change or the component
 * unmounts, which avoids the classic "flash of previous product" bug.
 */
export function useAsync<T>(task: () => Promise<Result<T>>, deps: unknown[]): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ServiceError | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  const taskRef = useRef(task);
  useEffect(() => {
    taskRef.current = task;
  }, [task]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    void taskRef
      .current()
      .then((result) => {
        if (!active) return;
        if (result.ok) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.error);
          setData(null);
        }
      })
      .catch(() => {
        if (!active) return;
        setError({ code: 'unknown', message: 'Something went wrong. Please try again.' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => {
    setNonce((value) => value + 1);
  }, []);

  return { data, error, loading, reload };
}
