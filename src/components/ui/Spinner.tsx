import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-void-200">
      <Loader2 aria-hidden className={cn('size-4 animate-spin', className)} />
      <span className={label ? 'text-sm' : 'sr-only'}>{label ?? 'Loading'}</span>
    </span>
  );
}
