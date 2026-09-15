import { memo, type CSSProperties } from 'react';
import { useCardTilt } from '@/hooks/useCardTilt';
import type { CardTheme } from '@/types/domain';
import { cn } from '@/utils/cn';
import { CARD_THEMES } from './cardThemes';

export interface DigitalCardProps {
  theme?: CardTheme;
  /** Fictional network wordmark printed on the plate. */
  network?: string;
  /** Denomination shown on the plate, e.g. 200 -> "$200". */
  value?: number;
  /** Product/brand line. */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Enables pointer tilt. Off for dense grids where many cards are on screen. */
  interactive?: boolean;
  /** Renders a soft coloured pool beneath the card. */
  glow?: boolean;
  className?: string;
}

const SIZES = {
  sm: 'w-full max-w-[260px] text-[10px]',
  md: 'w-full max-w-[360px] text-[11px]',
  lg: 'w-full max-w-[460px] text-[12px]',
} as const;

/**
 * Premium prepaid card object rendered entirely with CSS 3D transforms.
 *
 * Deliberate constraints:
 *  - The face shows only masked, non-usable placeholder information
 *    (XXXX XXXX XXXX XXXX / DEMO). It is decorative artwork, never credentials.
 *  - Motion is transform-only, so it stays on the compositor.
 *  - Tilt is suppressed for reduced-motion users and touch pointers by
 *    `useCardTilt`; the static plate still reads correctly.
 */
function DigitalCardBase({
  theme = 'graphite',
  network = 'VOID NETWORK',
  value,
  label = 'PREPAID',
  size = 'md',
  interactive = true,
  glow = true,
  className,
}: DigitalCardProps) {
  const tokens = CARD_THEMES[theme];
  const { tilt, onPointerMove, onPointerLeave } = useCardTilt(interactive ? 9 : 0);

  const bodyStyle: CSSProperties = {
    background: tokens.surface,
    borderColor: tokens.edge,
    color: tokens.ink,
    transform: `rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) translateZ(0)`,
    transition: tilt.active
      ? 'transform 90ms linear'
      : 'transform 620ms cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <div
      className={cn('card3d-scene relative', SIZES[size], className)}
      onPointerMove={interactive ? onPointerMove : undefined}
      onPointerLeave={interactive ? onPointerLeave : undefined}
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 -bottom-6 h-16 rounded-[50%] blur-2xl"
          style={{ background: tokens.glow }}
        />
      )}

      <div
        className="card3d-body relative aspect-[1.586/1] w-full overflow-hidden rounded-[16px] border shadow-[0_30px_70px_-34px_rgba(0,0,0,0.95),0_2px_0_rgba(255,255,255,0.05)_inset]"
        style={bodyStyle}
      >
        {/* Etched guilloche lines — depth without glow */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(115deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 7px)',
            maskImage: 'radial-gradient(120% 90% at 82% 8%, black 0%, transparent 62%)',
          }}
        />

        {/* Holographic sheen driven by pointer position */}
        <div
          aria-hidden
          className="holo pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: tilt.active ? 0.55 : 0.2,
            transform: `translateX(${((tilt.px - 0.5) * 26).toFixed(1)}%) translateY(${((tilt.py - 0.5) * 12).toFixed(1)}%)`,
          }}
        />

        {/* Specular edge highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[16px]"
          style={{
            boxShadow: `inset 0 1px 0 ${tokens.edge}, inset 0 -18px 40px -24px rgba(0,0,0,0.9)`,
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-[6.5%]">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="font-mono leading-none font-medium tracking-[0.28em]"
                style={{ color: tokens.ink }}
              >
                VOIDCARD
              </p>
              <p
                className="mt-[0.45em] font-mono leading-none tracking-[0.18em]"
                style={{ color: tokens.inkMuted }}
              >
                {label}
              </p>
            </div>
            <span
              className="rounded-[4px] border px-[0.6em] py-[0.35em] font-mono leading-none tracking-[0.16em]"
              style={{ borderColor: tokens.edge, color: tokens.inkMuted }}
            >
              DEMO
            </span>
          </div>

          <div className="flex items-end gap-[6%]">
            {/* Chip */}
            <div
              aria-hidden
              className="relative h-[2.9em] w-[3.8em] shrink-0 overflow-hidden rounded-[0.4em]"
              style={{ background: tokens.chip }}
            >
              <div
                className="absolute inset-0 opacity-45"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px)',
                  backgroundSize: '33% 50%',
                }}
              />
            </div>

            {value !== undefined && (
              <p
                className="text-[2.4em] leading-none font-medium tabular"
                style={{ color: tokens.ink }}
              >
                ${value}
              </p>
            )}
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              {/* Masked, intentionally non-usable placeholder. */}
              <p
                className="truncate font-mono tracking-[0.2em]"
                style={{ color: tokens.inkMuted }}
              >
                XXXX XXXX XXXX XXXX
              </p>
              <p
                className="mt-[0.5em] truncate font-mono tracking-[0.14em]"
                style={{ color: tokens.inkMuted }}
              >
                {network}
              </p>
            </div>

            {/* Contactless mark */}
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-[1.8em] w-[1.8em] shrink-0"
              style={{ color: tokens.inkMuted }}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M7 8.5a7 7 0 0 1 0 7" />
              <path d="M11 6a11 11 0 0 1 0 12" />
              <path d="M15 3.5a15 15 0 0 1 0 17" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export const DigitalCard = memo(DigitalCardBase);
