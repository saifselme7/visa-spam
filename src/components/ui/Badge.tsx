import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type BadgeTone = 'neutral' | 'accent' | 'amber' | 'red' | 'blue' | 'outline';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-white/6 text-void-100 border-white/8',
  accent: 'bg-accent-500/12 text-accent-400 border-accent-500/25',
  amber: 'bg-signal-amber/12 text-signal-amber border-signal-amber/25',
  red: 'bg-signal-red/12 text-signal-red border-signal-red/25',
  blue: 'bg-signal-blue/12 text-signal-blue border-signal-blue/25',
  outline: 'bg-transparent text-void-200 border-white/12',
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  mono?: boolean;
}

export function Badge({ children, tone = 'neutral', className, mono }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] leading-none font-medium',
        mono && 'font-mono tracking-[0.08em] uppercase',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
