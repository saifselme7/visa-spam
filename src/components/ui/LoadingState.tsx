import { Skeleton } from './Skeleton';
import { cn } from '@/utils/cn';

export interface LoadingStateProps {
  label?: string;
  rows?: number;
  className?: string;
}

/** Text-block skeleton. For product grids use <ProductGridSkeleton />. */
export function LoadingState({ label = 'Loading', rows = 3, className }: LoadingStateProps) {
  return (
    <div className={cn('space-y-3', className)} aria-busy role="status" aria-label={label}>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className={cn('h-4', index === rows - 1 ? 'w-2/5' : 'w-full')} />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}
