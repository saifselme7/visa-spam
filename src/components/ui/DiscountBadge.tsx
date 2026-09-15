import { cn } from '@/utils/cn';

export interface DiscountBadgeProps {
  percent: number;
  className?: string;
}

/** Compact "-6%" chip. Renders nothing at 0 so callers don't need a guard. */
export function DiscountBadge({ percent, className }: DiscountBadgeProps) {
  if (percent <= 0) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-accent-500/14 px-1.5 py-0.5 font-mono text-[11px] leading-none font-medium text-accent-400 tabular',
        className,
      )}
    >
      −{Math.round(percent)}%
    </span>
  );
}
