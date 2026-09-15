import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string | null;
  iconLeft?: ReactNode;
  trailing?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, iconLeft, trailing, className, required, ...rest },
  ref,
) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-void-100">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-accent-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {iconLeft && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-void-400 [&>svg]:size-[18px]"
          >
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(hint && hintId, error && errorId) || undefined}
          className={cn(
            'h-11 w-full rounded-[11px] border bg-void-900/70 px-3.5 text-sm text-void-50 transition-colors duration-200 placeholder:text-void-400',
            'focus:border-accent-500/60 focus:outline-none focus-visible:outline-none',
            iconLeft && 'pl-11',
            trailing && 'pr-12',
            error ? 'border-signal-red/50' : 'border-white/9 hover:border-white/16',
            className,
          )}
          {...rest}
        />
        {trailing && (
          <span className="absolute top-1/2 right-2 -translate-y-1/2">{trailing}</span>
        )}
      </div>

      {hint && !error && (
        <p id={hintId} className="mt-2 text-[12px] leading-snug text-void-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-[12px] leading-snug text-signal-red">
          {error}
        </p>
      )}
    </div>
  );
});
