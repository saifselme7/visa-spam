import type { ReactNode } from 'react';
import { Container } from './Container';
import { cn } from '@/utils/cn';

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  aside?: ReactNode;
  size?: 'default' | 'narrow';
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  aside,
  size = 'default',
  className,
}: PageHeaderProps) {
  return (
    <Container size={size} className={cn('pt-12 pb-8 sm:pt-16', className)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <p className="mono-label mb-3">{eyebrow}</p>}
          <h1 className="text-[28px] leading-[1.12] sm:text-[38px]">{title}</h1>
          {description && (
            <p className="mt-4 text-[15px] leading-relaxed text-void-200">{description}</p>
          )}
        </div>
        {(actions ?? aside) && (
          <div className="flex shrink-0 items-center gap-3">
            {aside}
            {actions}
          </div>
        )}
      </div>
    </Container>
  );
}
