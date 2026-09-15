import type { ReactNode } from 'react';
import { PageAtmosphere, type Atmosphere } from './PageAtmosphere';
import { cn } from '@/utils/cn';

/**
 * Wraps a route so it gets its own background identity plus a consistent
 * bottom rhythm.
 */
export function Page({
  atmosphere,
  children,
  className,
}: {
  atmosphere: Atmosphere;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative isolate pb-20', className)}>
      <PageAtmosphere variant={atmosphere} />
      <div className="relative">{children}</div>
    </div>
  );
}
