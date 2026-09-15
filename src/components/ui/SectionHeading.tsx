import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
        {eyebrow && <p className="mono-label mb-3">{eyebrow}</p>}
        <Tag className="text-2xl leading-tight sm:text-3xl">{title}</Tag>
        {description && (
          <p className="mt-3 text-[15px] leading-relaxed text-void-200">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
