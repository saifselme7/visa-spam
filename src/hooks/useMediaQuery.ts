import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && 'matchMedia' in window
      ? window.matchMedia(query).matches
      : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const media = window.matchMedia(query);
    setMatches((current) => (current === media.matches ? current : media.matches));
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    media.addEventListener('change', handler);
    return () => {
      media.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}
