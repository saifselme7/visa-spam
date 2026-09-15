import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export const CHECKOUT_STEPS = ['Review', 'Details', 'Payment', 'Status', 'Confirmation'] as const;
export type CheckoutStepIndex = 0 | 1 | 2 | 3 | 4;

export function CheckoutStepper({ current }: { current: CheckoutStepIndex }) {
  return (
    <nav aria-label="Checkout progress">
      <ol className="flex list-none items-center gap-2 overflow-x-auto p-0 no-scrollbar sm:gap-3">
        {CHECKOUT_STEPS.map((step, index) => {
          const complete = index < current;
          const active = index === current;
          return (
            <li key={step} className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] whitespace-nowrap transition-colors',
                  active && 'border-accent-500/45 bg-accent-500/12 text-accent-400',
                  complete && 'border-white/10 bg-void-850 text-void-100',
                  !active && !complete && 'border-white/7 text-void-400',
                )}
                aria-current={active ? 'step' : undefined}
              >
                <span
                  aria-hidden
                  className={cn(
                    'inline-flex size-4 items-center justify-center rounded-full font-mono text-[10px]',
                    complete ? 'bg-accent-500/20 text-accent-400' : 'bg-white/8 text-void-300',
                  )}
                >
                  {complete ? <Check className="size-2.5" /> : index + 1}
                </span>
                {step}
              </span>
              {index < CHECKOUT_STEPS.length - 1 && (
                <span aria-hidden className="h-px w-4 bg-white/10 sm:w-6" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
