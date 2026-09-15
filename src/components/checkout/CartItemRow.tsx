import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { ROUTES } from '@/config/site';
import type { CartLine } from '@/types/domain';
import { formatMoney } from '@/utils/format';
import { DigitalCard } from '@/components/cards/DigitalCard';

export interface CartItemRowProps {
  line: CartLine;
  maxQuantity: number;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
  readOnly?: boolean;
}

export function CartItemRow({
  line,
  maxQuantity,
  onIncrement,
  onDecrement,
  onRemove,
  readOnly,
}: CartItemRowProps) {
  const lineTotal = line.unitPrice * line.quantity;

  return (
    <li className="flex gap-4 py-5 sm:gap-6">
      <DigitalCard
        theme={line.theme}
        value={line.faceValue}
        size="sm"
        interactive={false}
        glow={false}
        className="w-28 shrink-0 sm:w-36"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              to={ROUTES.product(line.slug)}
              className="text-[14.5px] text-void-50 transition-colors hover:text-accent-400"
            >
              {line.name}
            </Link>
            <p className="mt-1 text-[12.5px] text-void-400 tabular">
              {formatMoney(line.unitPrice, line.currency)} each ·{' '}
              {formatMoney(line.faceValue, line.currency)} value
            </p>
          </div>
          <p className="shrink-0 text-[15px] font-medium text-void-50 tabular">
            {formatMoney(lineTotal, line.currency)}
          </p>
        </div>

        {!readOnly && (
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <div className="flex items-center rounded-[10px] border border-white/9">
              <button
                type="button"
                onClick={() => {
                  onDecrement(line.productId);
                }}
                aria-label={`Decrease quantity of ${line.name}`}
                className="inline-flex size-9 items-center justify-center text-void-200 hover:text-void-50"
              >
                <Minus aria-hidden className="size-3.5" />
              </button>
              <span className="min-w-7 text-center text-[13px] tabular" aria-live="polite">
                {line.quantity}
              </span>
              <button
                type="button"
                onClick={() => {
                  onIncrement(line.productId);
                }}
                disabled={line.quantity >= maxQuantity}
                aria-label={`Increase quantity of ${line.name}`}
                className="inline-flex size-9 items-center justify-center text-void-200 hover:text-void-50 disabled:opacity-35"
              >
                <Plus aria-hidden className="size-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onRemove(line.productId);
              }}
              className="inline-flex items-center gap-1.5 rounded-[9px] px-2 py-1.5 text-[12.5px] text-void-400 transition-colors hover:text-signal-red"
            >
              <Trash2 aria-hidden className="size-3.5" />
              Remove
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
