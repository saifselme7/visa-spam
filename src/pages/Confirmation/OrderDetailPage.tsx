import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileQuestion } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useAsync } from '@/hooks/useAsync';
import { useSeo } from '@/hooks/useSeo';
import { useToast } from '@/hooks/useToast';
import { orderService } from '@/services/orders';
import { formatDateTime, formatMoney } from '@/utils/format';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/checkout/OrderStatusBadge';
import { OrderTimeline } from '@/components/checkout/OrderTimeline';

export default function OrderDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { notify } = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const { data: order, error, loading, reload } = useAsync(
    () => orderService().getOrder(id),
    [id],
  );

  useSeo({
    title: order ? `Order ${order.reference}` : 'Order',
    description: 'Order status, items and payment progress.',
    path: ROUTES.order(id),
    noIndex: true,
  });

  if (loading) {
    return (
      <Page atmosphere="account">
        <Container className="pt-14 space-y-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-40 w-full rounded-[14px]" />
        </Container>
      </Page>
    );
  }

  if (error || !order) {
    return (
      <Page atmosphere="account">
        <Container size="narrow" className="pt-16">
          {error?.code === 'not_found' ? (
            <EmptyState
              icon={<FileQuestion />}
              title="Order not found"
              description="We couldn’t find that order on your account. Check the reference, or open a support ticket if you think this is wrong."
              action={
                <ButtonLink to={ROUTES.orders} size="sm">
                  Your orders
                </ButtonLink>
              }
            />
          ) : (
            <ErrorState error={error} onRetry={reload} />
          )}
        </Container>
      </Page>
    );
  }

  const canCancel =
    order.paymentStatus === 'pending' &&
    order.orderStatus !== 'cancelled' &&
    order.orderStatus !== 'completed';

  const onCancel = async () => {
    setCancelling(true);
    const result = await orderService().cancelOrder(order.id);
    setCancelling(false);
    setCancelOpen(false);
    if (result.ok) {
      notify({ title: 'Order cancelled', description: order.reference });
      reload();
    } else {
      notify({ title: 'Couldn’t cancel', description: result.error.message, tone: 'error' });
    }
  };

  return (
    <Page atmosphere="account">
      <Container className="pt-10">
        <Link
          to={ROUTES.orders}
          className="inline-flex items-center gap-1.5 text-[13px] text-void-300 transition-colors hover:text-void-50"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          All orders
        </Link>
      </Container>

      <Container className="pt-6">
        {order.orderStatus === 'completed' && (
          <div className="mb-8 flex items-start gap-3 rounded-[13px] border border-accent-500/25 bg-accent-500/[0.06] p-4">
            <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-500" />
            <div>
              <p className="text-[14px] font-medium text-void-50">Order delivered</p>
              <p className="mt-1 text-[13px] text-void-300">
                Codes were sent to {order.contactEmail}.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mono-label">Order</p>
            <h1 className="mt-1.5 font-mono text-[28px] tracking-[0.05em]">{order.reference}</h1>
            <p className="mt-2 text-[13px] text-void-400">
              Placed {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge status={order.orderStatus} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-10">
            <section aria-labelledby="items-heading">
              <h2 id="items-heading" className="mono-label mb-4">
                Items
              </h2>
              <ul className="list-none divide-y divide-white/7 border-y border-white/7 p-0">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <Link
                        to={ROUTES.product(item.productSlug)}
                        className="text-[14px] text-void-50 hover:text-accent-400"
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-[12.5px] text-void-400 tabular">
                        {item.quantity} × {formatMoney(item.unitPrice, order.currency)} ·{' '}
                        {formatMoney(item.faceValue, order.currency)} value
                      </p>
                    </div>
                    <p className="shrink-0 text-[14px] text-void-100 tabular">
                      {formatMoney(item.total, order.currency)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="timeline-heading">
              <h2 id="timeline-heading" className="mono-label mb-5">
                Progress
              </h2>
              <OrderTimeline status={order.orderStatus} />
            </section>
          </div>

          <div className="space-y-5 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
            <div className="panel rounded-[14px] p-5">
              <h2 className="text-[15px] font-medium">Totals</h2>
              <dl className="mt-4 space-y-2.5 text-[13.5px]">
                <div className="flex justify-between text-void-300">
                  <dt>Face value</dt>
                  <dd className="tabular">{formatMoney(order.subtotal, order.currency)}</dd>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-accent-500">
                    <dt>Discount</dt>
                    <dd className="tabular">−{formatMoney(order.discount, order.currency)}</dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between border-t border-white/7 pt-3">
                  <dt className="text-[15px] text-void-50">Total</dt>
                  <dd className="text-xl font-medium text-void-50 tabular">
                    {formatMoney(order.total, order.currency)}
                  </dd>
                </div>
              </dl>
              <dl className="mt-5 space-y-2 border-t border-white/7 pt-4 text-[12.5px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-void-400">Delivery email</dt>
                  <dd className="truncate text-void-200">{order.contactEmail}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-void-400">Updated</dt>
                  <dd className="text-void-200">{formatDateTime(order.updatedAt)}</dd>
                </div>
              </dl>
            </div>

            {canCancel && (
              <Button
                variant="danger"
                fullWidth
                onClick={() => {
                  setCancelOpen(true);
                }}
              >
                Cancel order
              </Button>
            )}

            <ButtonLink to={ROUTES.support} variant="secondary" fullWidth>
              Get help with this order
            </ButtonLink>
          </div>
        </div>
      </Container>

      <Modal
        open={cancelOpen}
        onClose={() => {
          setCancelOpen(false);
        }}
        title="Cancel this order?"
        description="You can cancel while payment is still pending. Nothing will be charged."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setCancelOpen(false);
              }}
            >
              Keep order
            </Button>
            <Button
              variant="danger"
              loading={cancelling}
              onClick={() => {
                void onCancel();
              }}
            >
              Cancel order
            </Button>
          </>
        }
      >
        <p>
          Order {order.reference} will be marked cancelled. If you have already sent a payment,
          contact support instead — cancelling will not return funds already in transit.
        </p>
      </Modal>
    </Page>
  );
}
