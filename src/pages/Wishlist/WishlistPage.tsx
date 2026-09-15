import { Heart, Trash2 } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useAsync } from '@/hooks/useAsync';
import { useCart } from '@/hooks/useCart';
import { useSeo } from '@/hooks/useSeo';
import { useToast } from '@/hooks/useToast';
import { useWishlist } from '@/hooks/useWishlist';
import { productService } from '@/services/products';
import { formatMoney } from '@/utils/format';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { AvailabilityTag, isPurchasable } from '@/components/cards/AvailabilityTag';
import { DigitalCard } from '@/components/cards/DigitalCard';

export default function WishlistPage() {
  useSeo({
    title: 'Wishlist',
    description: 'Cards you have saved on VOIDCARD.',
    path: ROUTES.wishlist,
    noIndex: true,
  });

  const { entries, remove, loading: wishlistLoading } = useWishlist();
  const { addItem } = useCart();
  const { notify } = useToast();

  const idKey = entries.map((entry) => entry.productId).join(',');
  const products = useAsync(
    () => productService().getProductsByIds(idKey ? idKey.split(',') : []),
    [idKey],
  );

  if (wishlistLoading || products.loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-28 rounded-[13px]" />
        <Skeleton className="h-28 rounded-[13px]" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg">Wishlist</h2>
      <p className="mt-2 text-[13.5px] text-void-300">
        Saved cards stay on this device and will sync to your account once cloud sync is enabled.
      </p>

      <div className="mt-7">
        {products.error && <ErrorState error={products.error} onRetry={products.reload} />}

        {products.data && products.data.length === 0 && (
          <EmptyState
            icon={<Heart />}
            title="Nothing saved yet"
            description="Tap the heart on any card to keep it here for later."
            action={
              <ButtonLink to={ROUTES.catalog} size="sm">
                Explore cards
              </ButtonLink>
            }
          />
        )}

        {products.data && products.data.length > 0 && (
          <ul className="list-none space-y-4 p-0">
            {products.data.map((product) => (
              <li
                key={product.id}
                className="flex flex-wrap items-center gap-5 rounded-[13px] border border-white/7 bg-void-900/50 p-5"
              >
                <DigitalCard
                  theme={product.art.theme}
                  value={product.faceValue}
                  size="sm"
                  interactive={false}
                  glow={false}
                  className="w-28 shrink-0"
                />

                <div className="min-w-[180px] flex-1">
                  <p className="mono-label mb-1.5">{product.categoryName}</p>
                  <h3 className="text-[15px] font-medium">{product.name}</h3>
                  <p className="mt-1.5 flex items-center gap-2 text-[13px] text-void-300 tabular">
                    {formatMoney(product.price, product.currency)}
                    <AvailabilityTag state={product.availability} />
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={!isPurchasable(product.availability)}
                    onClick={() => {
                      addItem(product, 1);
                      void remove(product.id);
                      notify({
                        title: 'Moved to cart',
                        description: product.name,
                        tone: 'success',
                      });
                    }}
                  >
                    Move to cart
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    iconLeft={<Trash2 />}
                    onClick={() => {
                      void remove(product.id);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
