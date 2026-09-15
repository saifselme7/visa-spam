import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Quiet, narrow container shared by every authentication screen. */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="relative isolate flex min-h-[calc(100dvh-var(--header-h))] items-center justify-center px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(77,224,192,0.08),transparent_62%)]"
      />
      <div
        aria-hidden
        className="dot-backdrop pointer-events-none absolute inset-0 -z-10 opacity-20 [mask-image:radial-gradient(60%_50%_at_50%_30%,black,transparent)]"
      />

      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex justify-center lg:hidden">
          <Logo />
        </div>

        <div className="panel rounded-[16px] p-7 sm:p-8">
          <h1 className="text-[22px] leading-tight">{title}</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-void-300">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-[13px] text-void-300">{footer}</div>}

        <p className="mt-8 text-center text-[12px] text-void-600">
          <Link to="/terms" className="hover:text-void-300">
            Terms
          </Link>
          <span className="mx-2">·</span>
          <Link to="/privacy" className="hover:text-void-300">
            Privacy
          </Link>
        </p>
      </div>
    </div>
  );
}
