import { Badge, type BadgeTone } from '@/components/ui/Badge';
import type { OrderStatus, PaymentStatus } from '@/types/domain';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pending',
  payment_processing: 'Payment processing',
  paid: 'Paid',
  preparing: 'Preparing',
  completed: 'Completed',
  cancelled: 'Cancelled',
  failed: 'Failed',
  refunded: 'Refunded',
};

const ORDER_TONE: Record<OrderStatus, BadgeTone> = {
  pending: 'neutral',
  payment_processing: 'blue',
  paid: 'accent',
  preparing: 'blue',
  completed: 'accent',
  cancelled: 'outline',
  failed: 'red',
  refunded: 'amber',
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: 'Awaiting payment',
  processing: 'Payment detected',
  paid: 'Payment confirmed',
  failed: 'Payment failed',
  expired: 'Payment expired',
  cancelled: 'Payment cancelled',
};

const PAYMENT_TONE: Record<PaymentStatus, BadgeTone> = {
  pending: 'neutral',
  processing: 'blue',
  paid: 'accent',
  failed: 'red',
  expired: 'amber',
  cancelled: 'outline',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge tone={ORDER_TONE[status]} mono>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge tone={PAYMENT_TONE[status]} mono>
      {PAYMENT_STATUS_LABEL[status]}
    </Badge>
  );
}
