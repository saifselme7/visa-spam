import { useEffect, useState } from 'react';

/**
 * Ticks down from an ISO expiry. Returns null when there is no expiry so the
 * UI can render "no time limit" rather than 00:00.
 */
export function useCountdown(expiresAt: string | null): number | null {
  const compute = () =>
    expiresAt ? Math.max(0, Math.round((Date.parse(expiresAt) - Date.now()) / 1000)) : null;

  const [remaining, setRemaining] = useState<number | null>(compute);

  useEffect(() => {
    if (!expiresAt) {
      setRemaining(null);
      return;
    }
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, Math.round((Date.parse(expiresAt) - Date.now()) / 1000)));
    }, 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, [expiresAt]);

  return remaining;
}
