import { AlertCircle } from 'lucide-react';

/** Inline, non-blocking form-level error banner. */
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-[11px] border border-signal-red/25 bg-signal-red/[0.06] px-3.5 py-3 text-[13px] leading-snug text-signal-red"
    >
      <AlertCircle aria-hidden className="mt-px size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
