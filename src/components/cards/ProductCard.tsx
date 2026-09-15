import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { useWishlist } from '@/hooks/useWishlist';
import type { Product } from '@/types/domain';
import { formatMoney } from '@/utils/format';
import { cn } from '@/utils/cn';
import { DiscountBadge } from '@/components/ui/DiscountBadge';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { AvailabilityTag, isPurchasable } from './AvailabilityTag';
import { DigitalCard } from './DigitalCard';

export interface ProductCardProps {
  product: Product;
  /** Compact variant used in dense rails. */
  dense?: boolean;
  className?: string;
}

function ProductCardBase({ product, dense, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { notify } = useToast();
  const { isSaved, toggle } = useWishlist();

  const saved = isSaved(product.id);
  const purchasable = isPurchasable(product.availability);

  const onAdd = useCallback(() => {
    addItem(product, 1);
    notify({
      title: 'Added to cart',
      description: `${product.name} · ${formatMoney(product.price, product.currency)}`,
      tone: 'success',
    });
  }, [addItem, notify, product]);

  const onToggleWishlist = useCallback(async () => {
    const nowSaved = await toggle(product.id);
    notify({
      title: nowSaved ? 'Saved to wishlist' : 'Removed from wishlist',
      description: product.name,
    });
  }, [notify, product.id, product.name, toggle]);

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[14px] border border-white/7 bg-void-900/60 transition-colors duration-300 hover:border-white/14',
        className,
      )}
    >
      <div className="relative overflow-hidden px-5 pt-6 pb-5">
        <div
          aria-hidden
          className="dot-backdrop pointer-events-none absolute inset-0 opacity-[0.35]"
        />
        <div className="relative flex justify-center">
          <DigitalCard
            theme={product.art.theme}
            network={product.art.network}
            value={product.faceValue}
            label={product.brand.toUpperCase()}
            size={dense ? 'sm' : 'md'}
            interactive={!dense}
            glow={false}
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            void onToggleWishlist();
          }}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={cn(
            'absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full border transition-colors duration-200',
            saved
              ? 'border-accent-500/40 bg-accent-500/12 text-accent-400'
              : 'border-white/8 bg-void-950/50 text-void-300 hover:text-void-50',
          )}
        >
          <Heart aria-hidden className="size-4" fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col border-t border-white/7 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mono-label mb-1.5">{product.categoryName}</p>
            <h3 className="truncate text-[15px] font-medium">
              <Link
                to={ROUTES.product(product.slug)}
                className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
              >
                {product.name}
              </Link>
            </h3>
          </div>
          <AvailabilityTag state={product.availability} className="shrink-0" />
        </div>

        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-void-300">
          {product.shortDescription}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="mono-label mb-1">{formatMoney(product.faceValue)} value</p>
            <PriceDisplay price={product.price} faceValue={product.faceValue} size="md" />
            {product.savings > 0 && (
              <p className="mt-1 flex items-center gap-2 text-[12px] text-accent-500">
                <DiscountBadge percent={product.discountPercent} />
                Save {formatMoney(product.savings, product.currency)}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onAdd}
            disabled={!purchasable}
            aria-label={`Add ${product.name} to cart`}
            className={cn(
              'relative z-10 inline-flex size-11 items-center justify-center rounded-[11px] border transition-colors duration-200',
              purchasable
                ? 'border-white/10 bg-void-800 text-void-50 hover:border-accent-500/40 hover:bg-accent-500/12 hover:text-accent-400'
                : 'cursor-not-allowed border-white/6 bg-void-850 text-void-500',
            )}
          >
            <Plus aria-hidden className="size-[18px]" />
          </button>
        </div>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardBase);
