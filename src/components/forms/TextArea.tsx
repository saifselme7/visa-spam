import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string | null;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, className, required, rows = 5, ...rest },
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
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(hint && hintId, error && errorId) || undefined}
        className={cn(
          'w-full resize-y rounded-[11px] border bg-void-900/70 px-3.5 py-3 text-sm leading-relaxed text-void-50 transition-colors duration-200 placeholder:text-void-400 focus:border-accent-500/60 focus:outline-none',
          error ? 'border-signal-red/50' : 'border-white/9 hover:border-white/16',
          className,
        )}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="mt-2 text-[12px] text-void-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-[12px] text-signal-red">
          {error}
        </p>
      )}
    </div>
  );
});
