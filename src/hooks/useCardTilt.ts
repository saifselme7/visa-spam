import { useCallback, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface TiltState {
  rotateX: number;
  rotateY: number;
  /** Pointer position in 0..1, used to drive the holographic sheen. */
  px: number;
  py: number;
  active: boolean;
}

const NEUTRAL: TiltState = { rotateX: 0, rotateY: 0, px: 0.5, py: 0.5, active: false };

/**
 * Pointer-driven 3D tilt.
 *
 * Writes through requestAnimationFrame and only transforms — no layout is
 * touched, so it stays on the compositor. Disabled entirely under
 * prefers-reduced-motion and on coarse pointers (touch), where a tilt that
 * follows a finger is more distracting than useful.
 */
export function useCardTilt(maxDeg = 9) {
  const reducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState<TiltState>(NEUTRAL);
  const frame = useRef<number | null>(null);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (reducedMotion || event.pointerType === 'touch') return;
      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setTilt({
          rotateX: (0.5 - py) * maxDeg * 2,
          rotateY: (px - 0.5) * maxDeg * 2,
          px,
          py,
          active: true,
        });
      });
    },
    [maxDeg, reducedMotion],
  );

  const onPointerLeave = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setTilt(NEUTRAL);
  }, []);

  return { tilt, onPointerMove, onPointerLeave, enabled: !reducedMotion };
}
