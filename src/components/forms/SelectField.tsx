import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  options: SelectOption[];
  hint?: string;
  error?: string | null;
  /** Renders the label visually hidden but still available to screen readers. */
  hideLabel?: boolean;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, options, hint, error, hideLabel, className, ...rest },
  ref,
) {
  const id = useId();

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={cn(
          'mb-2 block text-[13px] font-medium text-void-100',
          hideLabel && 'sr-only mb-0',
        )}
      >
        {label}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          className={cn(
            'h-11 w-full appearance-none rounded-[11px] border bg-void-900/70 pr-10 pl-3.5 text-sm text-void-50 transition-colors duration-200 focus:border-accent-500/60 focus:outline-none',
            error ? 'border-signal-red/50' : 'border-white/9 hover:border-white/16',
            className,
          )}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-void-900">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-void-400"
        />
      </div>
      {hint && !error && <p className="mt-2 text-[12px] text-void-400">{hint}</p>}
      {error && <p className="mt-2 text-[12px] text-signal-red">{error}</p>}
    </div>
  );
});
