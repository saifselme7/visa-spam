import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useCart } from '@/hooks/useCart';
import { formatMoney } from '@/utils/format';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { DigitalCard } from '@/components/cards/DigitalCard';

export interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { lines, totals, increment, decrement, removeItem, maxQuantity } = useCart();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Your cart"
      footer={
        lines.length > 0 ? (
          <div className="space-y-4">
            <dl className="space-y-2 text-[13px]">
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
              <div className="flex justify-between border-t border-white/7 pt-2 text-[15px] text-void-50">
                <dt className="font-medium">Total</dt>
                <dd className="font-medium tabular">
                  {formatMoney(totals.total, totals.currency)}
                </dd>
              </div>
            </dl>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={onClose}>
                Keep browsing
              </Button>
              <ButtonLink to={ROUTES.checkout} fullWidth onClick={onClose}>
                Checkout
              </ButtonLink>
            </div>
          </div>
        ) : undefined
      }
    >
      {lines.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag />}
          title="Your cart is empty"
          description="Browse the catalogue and add a denomination to get started."
          action={
            <ButtonLink to={ROUTES.catalog} size="sm" onClick={onClose}>
              Explore cards
            </ButtonLink>
          }
        />
      ) : (
        <ul className="list-none space-y-4 p-0">
          {lines.map((line) => (
            <li
              key={line.productId}
              className="flex gap-4 rounded-[12px] border border-white/7 bg-void-900/50 p-3"
            >
              <DigitalCard
                theme={line.theme}
                value={line.faceValue}
                size="sm"
                interactive={false}
                glow={false}
                className="w-24 shrink-0"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  to={ROUTES.product(line.slug)}
                  onClick={onClose}
                  className="truncate text-[14px] text-void-50 hover:text-accent-400"
                >
                  {line.name}
                </Link>
                <p className="mt-0.5 text-[12px] text-void-400 tabular">
                  {formatMoney(line.unitPrice, line.currency)} each
                </p>

                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                  <div className="flex items-center rounded-[9px] border border-white/9">
                    <button
                      type="button"
                      onClick={() => {
                        decrement(line.productId);
                      }}
                      aria-label={`Decrease quantity of ${line.name}`}
                      className="inline-flex size-8 items-center justify-center text-void-200 hover:text-void-50"
                    >
                      <Minus aria-hidden className="size-3.5" />
                    </button>
                    <span className="min-w-6 text-center text-[13px] tabular" aria-live="polite">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        increment(line.productId);
                      }}
                      disabled={line.quantity >= maxQuantity}
                      aria-label={`Increase quantity of ${line.name}`}
                      className="inline-flex size-8 items-center justify-center text-void-200 hover:text-void-50 disabled:opacity-35"
                    >
                      <Plus aria-hidden className="size-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      removeItem(line.productId);
                    }}
                    aria-label={`Remove ${line.name} from cart`}
                    className="inline-flex size-8 items-center justify-center rounded-[9px] text-void-400 transition-colors hover:text-signal-red"
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
