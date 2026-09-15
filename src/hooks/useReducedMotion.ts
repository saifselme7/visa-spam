import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Tracks the OS-level reduced-motion preference so JS-driven animation
 * (parallax, tilt, particles) can be skipped entirely rather than merely
 * shortened.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && 'matchMedia' in window
      ? window.matchMedia(QUERY).matches
      : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const media = window.matchMedia(QUERY);
    const handler = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };
    media.addEventListener('change', handler);
    return () => {
      media.removeEventListener('change', handler);
    };
  }, []);

  return reduced;
}
