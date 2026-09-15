import { useState } from 'react';
import { FlaskConical, X } from 'lucide-react';
import { isDemoBackend } from '@/config/env';

/**
 * Persistent, dismissible notice that the app is running on simulated data.
 * Nothing in demo mode represents a real transaction, so this must be visible
 * rather than buried in a footnote.
 */
export function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (!isDemoBackend || dismissed) return null;

  return (
    <div className="relative z-80 border-b border-accent-500/18 bg-accent-500/[0.06]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <FlaskConical aria-hidden className="size-3.5 shrink-0 text-accent-500" />
        <p className="flex-1 text-[12px] leading-snug text-accent-400">
          <span className="font-mono tracking-[0.1em] uppercase">Demo mode</span>
          <span className="text-void-200">
            {' '}
            — accounts, orders and payments are simulated locally. No real money moves.
          </span>
        </p>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
          }}
          aria-label="Dismiss demo mode notice"
          className="-m-1 rounded p-1 text-void-400 transition-colors hover:text-void-100"
        >
          <X aria-hidden className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
