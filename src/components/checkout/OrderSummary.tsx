import type { CartTotals } from '@/types/domain';
import { formatMoney, pluralize } from '@/utils/format';

export function OrderSummary({
  totals,
  children,
}: {
  totals: CartTotals;
  children?: React.ReactNode;
}) {
  return (
    <div className="panel rounded-[14px] p-5">
      <h2 className="text-[15px] font-medium">Summary</h2>
      <p className="mono-label mt-1">
        {totals.itemCount} {pluralize(totals.itemCount, 'item')}
      </p>

      <dl className="mt-5 space-y-2.5 text-[13.5px]">
        <div className="flex justify-between text-void-300">
          <dt>Face value</dt>
          <dd className="tabular">{formatMoney(totals.subtotal, totals.currency)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-accent-500">
            <dt>Discount</dt>
            <dd className="tabular">−{formatMoney(totals.discount, totals.currency)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between border-t border-white/7 pt-3">
          <dt className="text-[15px] text-void-50">Total</dt>
          <dd className="text-xl font-medium text-void-50 tabular">
            {formatMoney(totals.total, totals.currency)}
          </dd>
        </div>
      </dl>

      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
