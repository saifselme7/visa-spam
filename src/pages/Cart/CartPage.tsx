import { ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useCart } from '@/hooks/useCart';
import { useSeo } from '@/hooks/useSeo';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { PageHeader } from '@/components/layout/PageHeader';
import { CartItemRow } from '@/components/checkout/CartItemRow';
import { OrderSummary } from '@/components/checkout/OrderSummary';

export default function CartPage() {
  useSeo({
    title: 'Cart',
    description: 'Review the cards in your VOIDCARD cart before checkout.',
    path: ROUTES.cart,
    noIndex: true,
  });

  const { lines, totals, increment, decrement, removeItem, maxQuantity } = useCart();

  return (
    <Page atmosphere="checkout">
      <PageHeader
        eyebrow="Cart"
        title="Review your order"
        description="Quantities are capped at 10 per denomination. Prices are re-checked when the order is created."
      />

      <Container>
        {lines.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag />}
            title="Your cart is empty"
            description="Nothing here yet. Browse the catalogue or check the current deals."
            action={
              <div className="flex gap-3">
                <ButtonLink to={ROUTES.catalog} size="sm">
                  Explore cards
                </ButtonLink>
                <ButtonLink to={ROUTES.deals} size="sm" variant="secondary">
                  View deals
                </ButtonLink>
              </div>
            }
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <ul className="list-none divide-y divide-white/7 border-y border-white/7 p-0">
              {lines.map((line) => (
                <CartItemRow
                  key={line.productId}
                  line={line}
                  maxQuantity={maxQuantity}
                  onIncrement={increment}
                  onDecrement={decrement}
                  onRemove={removeItem}
                />
              ))}
            </ul>

            <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
              <OrderSummary totals={totals}>
                <ButtonLink to={ROUTES.checkout} fullWidth size="lg">
                  Continue to checkout
                </ButtonLink>
                <p className="mt-3 text-center text-[12px] text-void-500">
                  You’ll choose a payment asset on the next step.
                </p>
              </OrderSummary>
            </div>
          </div>
        )}
      </Container>
    </Page>
  );
}
