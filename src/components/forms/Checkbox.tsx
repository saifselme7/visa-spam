import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  label: ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, ...rest },
  ref,
) {
  const id = useId();
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <span className="relative mt-0.5 inline-flex size-[18px] shrink-0">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="peer size-[18px] cursor-pointer appearance-none rounded-[5px] border border-white/16 bg-void-900 transition-colors checked:border-accent-500 checked:bg-accent-500"
          {...rest}
        />
        <Check
          aria-hidden
          className="pointer-events-none absolute inset-0 m-auto size-3 text-void-950 opacity-0 peer-checked:opacity-100"
        />
      </span>
      <label htmlFor={id} className="cursor-pointer text-[13px] leading-snug text-void-100">
        {label}
        {description && <span className="mt-1 block text-[12px] text-void-400">{description}</span>}
      </label>
    </div>
  );
});
