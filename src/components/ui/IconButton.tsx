import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only controls must expose an accessible name. */
  label: string;
  icon: ReactNode;
  size?: 'sm' | 'md';
  tone?: 'default' | 'active';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, size = 'md', tone = 'default', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-[10px] border transition-colors duration-200',
        size === 'sm' ? 'size-9' : 'size-11',
        tone === 'active'
          ? 'border-accent-500/40 bg-accent-500/12 text-accent-400'
          : 'border-white/8 bg-void-850/60 text-void-100 hover:border-white/18 hover:text-void-50',
        className,
      )}
      {...rest}
    >
      <span aria-hidden className="[&>svg]:size-[18px]">
        {icon}
      </span>
    </button>
  );
});
