import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function Container({
  children,
  className,
  size = 'default',
}: {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        size === 'narrow' && 'max-w-3xl',
        size === 'default' && 'max-w-7xl',
        size === 'wide' && 'max-w-[1600px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
