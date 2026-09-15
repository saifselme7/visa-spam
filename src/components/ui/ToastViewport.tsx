import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, Info, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { ToastTone } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

const ICONS: Record<ToastTone, typeof Check> = {
  default: Info,
  success: Check,
  error: AlertCircle,
};

const TONES: Record<ToastTone, string> = {
  default: 'text-void-200',
  success: 'text-accent-400',
  error: 'text-signal-red',
};

export function ToastViewport() {
  const { toasts, dismiss } = useToast();
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-90 flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.tone];
          return (
            <motion.div
              key={toast.id}
              layout={!reducedMotion}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="panel pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[12px] px-4 py-3 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)]"
            >
              <Icon aria-hidden className={cn('mt-0.5 size-4 shrink-0', TONES[toast.tone])} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-void-50">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-[13px] leading-snug text-void-300">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  dismiss(toast.id);
                }}
                aria-label="Dismiss notification"
                className="-m-1 rounded p-1 text-void-400 transition-colors hover:text-void-100"
              >
                <X aria-hidden className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
