import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/config/site';
import type { Order } from '@/types/domain';
import { formatDate, formatMoney, pluralize } from '@/utils/format';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/checkout/OrderStatusBadge';

export function OrderCard({ order }: { order: Order }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="group relative rounded-[13px] border border-white/7 bg-void-900/50 p-5 transition-colors hover:border-white/14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mono-label">{formatDate(order.createdAt)}</p>
          <h3 className="mt-1 font-mono text-[15px] tracking-[0.06em] text-void-50">
            {order.reference}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={order.orderStatus} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <ul className="mt-4 list-none space-y-1 p-0">
        {order.items.slice(0, 3).map((item) => (
          <li key={item.id} className="flex justify-between gap-4 text-[13px]">
            <span className="truncate text-void-200">
              {item.quantity} × {item.productName}
            </span>
            <span className="shrink-0 text-void-300 tabular">
              {formatMoney(item.total, order.currency)}
            </span>
          </li>
        ))}
        {order.items.length > 3 && (
          <li className="text-[12px] text-void-500">
            +{order.items.length - 3} more {pluralize(order.items.length - 3, 'line')}
          </li>
        )}
      </ul>

      <div className="mt-5 flex items-end justify-between border-t border-white/7 pt-4">
        <div>
          <p className="mono-label">
            {itemCount} {pluralize(itemCount, 'item')}
          </p>
          <p className="mt-1 text-[17px] font-medium text-void-50 tabular">
            {formatMoney(order.total, order.currency)}
          </p>
        </div>
        <Link
          to={ROUTES.order(order.id)}
          className="inline-flex items-center gap-1.5 text-[13px] text-accent-500 transition-colors after:absolute after:inset-0 after:content-[''] hover:text-accent-400"
        >
          View order
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
