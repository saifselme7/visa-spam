import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  compact,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[14px] border border-dashed border-white/10 bg-void-900/40 px-6 text-center',
        compact ? 'py-10' : 'py-16',
        className,
      )}
    >
      {icon && (
        <span
          aria-hidden
          className="mb-5 inline-flex size-12 items-center justify-center rounded-full border border-white/8 bg-void-850 text-void-300 [&>svg]:size-5"
        >
          {icon}
        </span>
      )}
      <h3 className="text-base font-medium">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-void-300">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
