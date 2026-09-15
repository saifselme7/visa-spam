import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Clock, Info, ShieldCheck } from 'lucide-react';
import { isDemoBackend } from '@/config/env';
import { useCountdown } from '@/hooks/useCountdown';
import { paymentService } from '@/services/payments';
import type { PaymentSnapshot } from '@/services/payments';
import type { PaymentStatus } from '@/types/domain';
import { formatDuration, formatMoney } from '@/utils/format';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PaymentStatusBadge } from './OrderStatusBadge';
import { cn } from '@/utils/cn';

export interface PaymentPanelProps {
  snapshot: PaymentSnapshot;
  onSnapshot: (snapshot: PaymentSnapshot) => void;
  onCancel?: () => void;
}

const POLL_INTERVAL_MS = 2500;

const STATUS_COPY: Record<PaymentStatus, { title: string; detail: string }> = {
  pending: {
    title: 'Waiting for payment',
    detail: 'Send the exact amount to the address issued by the payment provider.',
  },
  processing: {
    title: 'Payment detected',
    detail: 'The provider has seen the transfer and is waiting for confirmations.',
  },
  paid: {
    title: 'Payment confirmed',
    detail: 'The provider confirmed the payment. Your codes are being issued.',
  },
  failed: {
    title: 'Payment failed',
    detail: 'The provider could not settle this payment. No funds were captured.',
  },
  expired: {
    title: 'Payment window closed',
    detail: 'The quote expired. Start a new payment to get a fresh rate and address.',
  },
  cancelled: {
    title: 'Payment cancelled',
    detail: 'This payment was cancelled. You can create a new one from your order.',
  },
};

/**
 * Crypto payment screen.
 *
 * The status shown here is always read from the payment service — the UI never
 * concludes that funds arrived. "I've sent the payment" is an advisory hint that
 * asks the provider to look sooner; it does not change the payment state.
 */
export function PaymentPanel({ snapshot, onSnapshot, onCancel }: PaymentPanelProps) {
  const [reporting, setReporting] = useState(false);
  const [pollError, setPollError] = useState<string | null>(null);
  const remaining = useCountdown(snapshot.intent.expiresAt);
  const onSnapshotRef = useRef(onSnapshot);
  useEffect(() => {
    onSnapshotRef.current = onSnapshot;
  }, [onSnapshot]);

  const { intent } = snapshot;
  const settled =
    intent.status === 'paid' || intent.status === 'failed' || intent.status === 'cancelled';

  useEffect(() => {
    if (settled) return;
    let active = true;

    const tick = async () => {
      const result = await paymentService().pollPayment(intent.id);
      if (!active) return;
      if (result.ok) {
        setPollError(null);
        onSnapshotRef.current(result.data);
      } else {
        setPollError(result.error.message);
      }
    };

    const timer = window.setInterval(() => {
      void tick();
    }, POLL_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [intent.id, settled]);

  const copy = STATUS_COPY[intent.status];
  const expiringSoon = remaining !== null && remaining > 0 && remaining < 120;

  const onReport = async () => {
    setReporting(true);
    const result = await paymentService().reportPaymentSent(intent.id);
    setReporting(false);
    if (result.ok) onSnapshot(result.data);
    else setPollError(result.error.message);
  };

  return (
    <section
      aria-labelledby="payment-status-heading"
      className="panel overflow-hidden rounded-[14px]"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/7 px-5 py-4">
        <div>
          <p className="mono-label">Order {intent.orderReference}</p>
          <h2 id="payment-status-heading" className="mt-1 text-[15px] font-medium">
            {copy.title}
          </h2>
        </div>
        <PaymentStatusBadge status={intent.status} />
      </header>

      <div className="grid gap-px bg-white/6 sm:grid-cols-2">
        <dl className="space-y-3 bg-void-900 p-5 text-[13px]">
          <div className="flex justify-between gap-4">
            <dt className="text-void-400">Method</dt>
            <dd className="text-void-50">
              {intent.method} · {intent.network}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-void-400">Amount</dt>
            <dd className="text-void-50 tabular">{formatMoney(intent.amount, intent.currency)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-void-400">Quoted</dt>
            <dd className="font-mono text-void-50 tabular">
              {intent.cryptoAmount ? `${intent.cryptoAmount} ${intent.method}` : 'Pending quote'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-void-400">Provider</dt>
            <dd className="text-void-200">{intent.provider}</dd>
          </div>
        </dl>

        <div className="bg-void-900 p-5">
          <div className="flex items-center justify-between">
            <span className="mono-label">Payment window</span>
            <Clock aria-hidden className="size-4 text-void-400" />
          </div>
          <p
            className={cn(
              'mt-2 font-mono text-3xl tabular',
              expiringSoon ? 'text-signal-amber' : 'text-void-50',
            )}
            aria-live="off"
          >
            {remaining === null ? '—' : formatDuration(remaining)}
          </p>
          <p className="mt-2 text-[12px] leading-snug text-void-400">
            {remaining === 0
              ? 'This quote has expired.'
              : 'The quoted amount is valid until the timer runs out.'}
          </p>
        </div>
      </div>

      <div className="space-y-4 border-t border-white/7 p-5">
        <div className="rounded-[12px] border border-white/8 bg-void-850/70 p-4">
          <p className="mono-label mb-2">Payment instructions</p>
          {intent.depositAddress ? (
            <p className="font-mono text-[13px] break-all text-void-50">{intent.depositAddress}</p>
          ) : (
            <p className="text-[13px] leading-relaxed text-void-300">
              A deposit address and exact amount are issued by the payment provider when the
              provider is connected. No address is generated in the browser, and none is shown in
              demo mode.
            </p>
          )}
          <p className="mt-3 flex items-start gap-2 text-[12px] leading-snug text-void-400">
            <Info aria-hidden className="mt-px size-3.5 shrink-0" />
            Send on the {intent.network} network only. Transfers on other networks cannot be
            recovered.
          </p>
        </div>

        <p className="text-[13px] leading-relaxed text-void-200">{copy.detail}</p>

        {isDemoBackend && (
          <div className="flex items-start gap-2.5 rounded-[11px] border border-signal-amber/25 bg-signal-amber/[0.06] px-3.5 py-3 text-[12.5px] leading-snug text-signal-amber">
            <AlertTriangle aria-hidden className="mt-px size-4 shrink-0" />
            <span>
              <strong className="font-medium">Demo environment.</strong> These states are produced
              by a local simulator on a timer. Nothing is sent, received or verified on any
              blockchain.
            </span>
          </div>
        )}

        {pollError && (
          <p role="alert" className="text-[12.5px] text-signal-red">
            {pollError}
          </p>
        )}

        {!settled && (
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                void onReport();
              }}
              loading={reporting}
              disabled={intent.status !== 'pending'}
            >
              I’ve sent the payment
            </Button>
            {onCancel && (
              <Button variant="ghost" onClick={onCancel}>
                Cancel payment
              </Button>
            )}
          </div>
        )}

        <p className="flex items-start gap-2 border-t border-white/7 pt-4 text-[12px] leading-snug text-void-500">
          <ShieldCheck aria-hidden className="mt-px size-3.5 shrink-0" />
          Telling us you’ve paid only asks the provider to check sooner. An order is only marked
          paid after the provider independently confirms the transfer.
        </p>

        {snapshot.transactions.length > 0 && (
          <div>
            <p className="mono-label mb-2">Provider events</p>
            <ul className="list-none space-y-1.5 p-0">
              {snapshot.transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex items-center justify-between gap-3 rounded-[9px] bg-void-850/60 px-3 py-2 text-[12px]"
                >
                  <span className="text-void-200">{STATUS_COPY[transaction.status].title}</span>
                  <Badge tone="outline" mono>
                    {transaction.confirmations}/{transaction.requiredConfirmations} conf
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
