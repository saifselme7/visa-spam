import { Check, Circle, X } from 'lucide-react';
import type { OrderStatus } from '@/types/domain';
import { cn } from '@/utils/cn';

const HAPPY_PATH: { status: OrderStatus; label: string; detail: string }[] = [
  { status: 'pending', label: 'Order created', detail: 'Waiting for payment to be sent.' },
  {
    status: 'payment_processing',
    label: 'Payment processing',
    detail: 'Funds seen on-chain, waiting for confirmations.',
  },
  { status: 'paid', label: 'Payment confirmed', detail: 'Confirmed by the payment provider.' },
  { status: 'preparing', label: 'Preparing codes', detail: 'Codes are being issued.' },
  { status: 'completed', label: 'Delivered', detail: 'Codes sent to your email.' },
];

const TERMINAL: Partial<Record<OrderStatus, { label: string; detail: string }>> = {
  cancelled: { label: 'Cancelled', detail: 'This order was cancelled before payment completed.' },
  failed: { label: 'Failed', detail: 'The payment could not be completed.' },
  refunded: { label: 'Refunded', detail: 'The order total was returned.' },
};

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const terminal = TERMINAL[status];
  const activeIndex = HAPPY_PATH.findIndex((step) => step.status === status);

  return (
    <ol className="relative list-none space-y-0 p-0">
      {HAPPY_PATH.map((step, index) => {
        const complete = !terminal && activeIndex > index;
        const current = !terminal && activeIndex === index;
        const isLast = index === HAPPY_PATH.length - 1;

        return (
          <li key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  'absolute top-6 left-[11px] h-[calc(100%-12px)] w-px',
                  complete ? 'bg-accent-500/40' : 'bg-white/8',
                )}
              />
            )}
            <span
              aria-hidden
              className={cn(
                'relative mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border',
                complete && 'border-accent-500/50 bg-accent-500/15 text-accent-400',
                current && 'border-accent-500 bg-accent-500 text-void-950',
                !complete && !current && 'border-white/10 bg-void-900 text-void-500',
              )}
            >
              {complete ? <Check className="size-3.5" /> : <Circle className="size-2 fill-current" />}
              {current && (
                <span className="absolute inset-0 animate-[pulse-ring_2.2s_ease-out_infinite] rounded-full border border-accent-500" />
              )}
            </span>
            <div className="min-w-0 pt-0.5">
              <p
                className={cn(
                  'text-[14px]',
                  complete || current ? 'text-void-50' : 'text-void-400',
                )}
              >
                {step.label}
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-void-400">{step.detail}</p>
            </div>
          </li>
        );
      })}

      {terminal && (
        <li className="relative flex gap-4">
          <span
            aria-hidden
            className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-signal-red/40 bg-signal-red/12 text-signal-red"
          >
            <X className="size-3.5" />
          </span>
          <div className="pt-0.5">
            <p className="text-[14px] text-void-50">{terminal.label}</p>
            <p className="mt-1 text-[12.5px] leading-snug text-void-400">{terminal.detail}</p>
          </div>
        </li>
      )}
    </ol>
  );
}
