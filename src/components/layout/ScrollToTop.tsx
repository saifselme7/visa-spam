import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Restores scroll position on navigation — routers don't do this by default. */
export function ScrollToTop() {
  const { pathname } = useLocation();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // `pathname` is read here purely so the effect re-runs on every navigation.
    void pathname;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [pathname, reducedMotion]);

  return null;
}
