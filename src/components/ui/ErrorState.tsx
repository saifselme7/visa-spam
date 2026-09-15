import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';
import type { ServiceError } from '@/types/result';

export interface ErrorStateProps {
  title?: string;
  error?: ServiceError | null;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Renders a service error. `error.message` is always user-safe by construction
 * (see types/result.ts), so nothing technical leaks here.
 */
export function ErrorState({ title, error, description, onRetry, className }: ErrorStateProps) {
  const message =
    description ?? error?.message ?? 'Something went wrong while loading this section.';

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center rounded-[14px] border border-signal-red/20 bg-signal-red/[0.04] px-6 py-14 text-center',
        className,
      )}
    >
      <span
        aria-hidden
        className="mb-5 inline-flex size-12 items-center justify-center rounded-full border border-signal-red/25 bg-signal-red/10 text-signal-red"
      >
        <AlertTriangle className="size-5" />
      </span>
      <h3 className="text-base font-medium">{title ?? 'We hit a problem'}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-void-200">{message}</p>
      {onRetry && (
        <Button className="mt-6" variant="secondary" size="sm" onClick={onRetry} iconLeft={<RefreshCw />}>
          Try again
        </Button>
      )}
    </div>
  );
}
