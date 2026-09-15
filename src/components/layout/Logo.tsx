import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

/**
 * Wordmark with a small aperture glyph. Drawn inline so it stays crisp at any
 * size and inherits currentColor.
 */
export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="VOIDCARD — home"
      className={cn(
        'group inline-flex items-center gap-2.5 text-void-50 transition-opacity hover:opacity-85',
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 28 28"
        className="size-6 shrink-0"
        fill="none"
        stroke="currentColor"
      >
        <rect x="1.4" y="1.4" width="25.2" height="25.2" rx="7.2" strokeWidth="1.4" opacity="0.55" />
        <path
          d="M8.6 9.2 14 19.4l5.4-10.2"
          strokeWidth="1.7"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <circle cx="14" cy="14" r="2.1" className="fill-accent-500" stroke="none" opacity="0.9" />
      </svg>
      {!compact && (
        <span className="font-mono text-[15px] leading-none font-medium tracking-[0.22em]">
          VOIDCARD
        </span>
      )}
    </Link>
  );
}
