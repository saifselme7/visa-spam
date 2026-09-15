import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Normalised pointer offset (-0.5..0.5) for hero parallax layers.
 * Listener is passive, throttled to one rAF, and never attached at all when
 * reduced motion is requested or the pointer is coarse.
 */
export function usePointerParallax(enabled = true) {
  const reducedMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || reducedMotion) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handler = (event: PointerEvent) => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        setOffset({
          x: event.clientX / window.innerWidth - 0.5,
          y: event.clientY / window.innerHeight - 0.5,
        });
      });
    };

    window.addEventListener('pointermove', handler, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handler);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [enabled, reducedMotion]);

  return reducedMotion ? { x: 0, y: 0 } : offset;
}
