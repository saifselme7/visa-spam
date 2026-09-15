import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'relative inline-flex select-none items-center justify-center gap-2 font-medium transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-45 active:translate-y-px';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-500 text-void-950 hover:bg-accent-400 shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_30px_-12px_rgba(77,224,192,0.55)]',
  secondary:
    'bg-void-800/80 text-void-50 border border-white/8 hover:border-white/18 hover:bg-void-700/80',
  ghost: 'text-void-100 hover:bg-white/6 hover:text-void-50',
  danger: 'bg-signal-red/12 text-signal-red border border-signal-red/30 hover:bg-signal-red/18',
  link: 'text-accent-500 hover:text-accent-400 underline-offset-4 hover:underline px-0',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-[10px] px-3.5 text-[13px]',
  md: 'h-11 rounded-[11px] px-5 text-sm',
  lg: 'h-13 rounded-[12px] px-7 text-[15px]',
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

function content({ loading, iconLeft, iconRight, children }: CommonProps) {
  return (
    <>
      {loading ? (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      ) : (
        iconLeft && (
          <span aria-hidden className="shrink-0 [&>svg]:size-4">
            {iconLeft}
          </span>
        )
      )}
      {children}
      {iconRight && !loading && (
        <span aria-hidden className="shrink-0 [&>svg]:size-4">
          {iconRight}
        </span>
      )}
    </>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth,
    iconLeft,
    iconRight,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {content({ loading, iconLeft, iconRight, children })}
    </button>
  );
});

export interface ButtonLinkProps extends CommonProps {
  to: string;
  'aria-label'?: string;
  onClick?: () => void;
  state?: unknown;
}

/** Same visual language as Button, rendered as a router link. */
export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  fullWidth,
  iconLeft,
  iconRight,
  className,
  children,
  state,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      state={state}
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {content({ iconLeft, iconRight, children })}
    </Link>
  );
}
