import { useEffect, useState } from 'react';

/** Delays propagation of fast-changing values such as search input. */
export function useDebouncedValue<T>(value: T, delayMs = 220): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounced(value);
    }, delayMs);
    return () => {
      window.clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debounced;
}
