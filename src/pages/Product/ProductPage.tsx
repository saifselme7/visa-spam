import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Heart, Minus, PackageX, Plus, ShieldCheck, Zap } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useAsync } from '@/hooks/useAsync';
import { useCart } from '@/hooks/useCart';
import { useSeo } from '@/hooks/useSeo';
import { useToast } from '@/hooks/useToast';
import { useWishlist } from '@/hooks/useWishlist';
import { productService } from '@/services/products';
import { formatMoney } from '@/utils/format';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { DiscountBadge } from '@/components/ui/DiscountBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { AvailabilityTag, isPurchasable } from '@/components/cards/AvailabilityTag';
import { DigitalCard } from '@/components/cards/DigitalCard';
import { ProductGrid } from '@/components/cards/ProductGrid';

export default function ProductPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { notify } = useToast();
  const { isSaved, toggle } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const { data: product, error, loading, reload } = useAsync(
    () => productService().getProduct(id),
    [id],
  );

  const related = useAsync(
    async () => {
      const result = await productService().listProducts({
        categories: product ? [product.categorySlug] : [],
        pageSize: 4,
      });
      if (!result.ok) return result;
      return {
        ok: true as const,
        data: result.data.items.filter((item) => item.id !== product?.id).slice(0, 3),
      };
    },
    [product?.id, product?.categorySlug],
  );

  useSeo({
    title: product ? product.name : loading ? 'Loading card' : 'Card not found',
    description:
      product?.shortDescription ??
      'Prepaid and gift card denominations delivered digitally by VOIDCARD.',
    path: ROUTES.product(id),
    type: 'product',
    noIndex: !product,
  });

  if (loading) {
    return (
      <Page atmosphere="product">
        <Container className="pt-14">
          <div className="grid gap-12 lg:grid-cols-2">
            <Skeleton className="aspect-[1.586/1] w-full rounded-[16px]" />
            <div className="space-y-4">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </Container>
      </Page>
    );
  }

  if (error || !product) {
    return (
      <Page atmosphere="product">
        <Container className="pt-16" size="narrow">
          {error?.code === 'not_found' ? (
            <EmptyState
              icon={<PackageX />}
              title="This card isn’t available"
              description="It may have been retired or the link is out of date."
              action={
                <ButtonLink to={ROUTES.catalog} size="sm">
                  Browse the catalogue
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

  const purchasable = isPurchasable(product.availability);
  const saved = isSaved(product.id);

  const onAdd = () => {
    addItem(product, quantity);
    notify({
      title: 'Added to cart',
      description: `${quantity} × ${product.name}`,
      tone: 'success',
    });
  };

  const onBuyNow = () => {
    addItem(product, quantity);
    navigate(ROUTES.checkout);
  };

  return (
    <Page atmosphere="product">
      <Container className="pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex list-none flex-wrap items-center gap-1.5 p-0 text-[12px] text-void-400">
            <li>
              <Link to={ROUTES.catalog} className="transition-colors hover:text-void-100">
                Catalogue
              </Link>
            </li>
            <ChevronRight aria-hidden className="size-3" />
            <li>
              <Link
                to={`${ROUTES.catalog}`}
                className="transition-colors hover:text-void-100"
              >
                {product.categoryName}
              </Link>
            </li>
            <ChevronRight aria-hidden className="size-3" />
            <li aria-current="page" className="text-void-200">
              {product.name}
            </li>
          </ol>
        </nav>
      </Container>

      <Container className="pt-10 pb-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
          {/* Dramatic single-source lighting around the card */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_55%_at_35%_25%,rgba(150,180,220,0.14),transparent_70%)]"
            />
            <div className="flex justify-center lg:sticky lg:top-[calc(var(--header-h)+32px)]">
              <DigitalCard
                theme={product.art.theme}
                network={product.art.network}
                value={product.faceValue}
                label={product.brand.toUpperCase()}
                size="lg"
              />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="outline" mono>
                {product.categoryName}
              </Badge>
              <AvailabilityTag state={product.availability} />
              {product.featured && (
                <Badge tone="accent" mono>
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="mt-5 text-[30px] leading-tight sm:text-[38px]">{product.name}</h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-void-200">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-3 border-y border-white/7 py-6">
              <div>
                <p className="mono-label mb-2">You pay</p>
                <PriceDisplay
                  price={product.price}
                  faceValue={product.faceValue}
                  size="lg"
                  currency={product.currency}
                />
              </div>
              {product.savings > 0 && (
                <div className="pb-1.5">
                  <p className="flex items-center gap-2 text-[13px] text-accent-500">
                    <DiscountBadge percent={product.discountPercent} />
                    Save {formatMoney(product.savings, product.currency)}
                  </p>
                  <p className="mt-1 text-[12px] text-void-400">
                    Face value {formatMoney(product.faceValue, product.currency)}
                  </p>
                </div>
              )}
            </div>

            {purchasable ? (
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="flex h-12 items-center rounded-[11px] border border-white/9">
                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((value) => Math.max(1, value - 1));
                    }}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="inline-flex size-11 items-center justify-center text-void-200 hover:text-void-50 disabled:opacity-35"
                  >
                    <Minus aria-hidden className="size-4" />
                  </button>
                  <span className="min-w-8 text-center text-sm tabular" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((value) => Math.min(10, value + 1));
                    }}
                    disabled={quantity >= 10}
                    aria-label="Increase quantity"
                    className="inline-flex size-11 items-center justify-center text-void-200 hover:text-void-50 disabled:opacity-35"
                  >
                    <Plus aria-hidden className="size-4" />
                  </button>
                </div>

                <Button size="lg" onClick={onAdd}>
                  Add to cart
                </Button>
                <Button size="lg" variant="secondary" onClick={onBuyNow}>
                  Buy now
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  aria-pressed={saved}
                  iconLeft={<Heart />}
                  onClick={() => {
                    void toggle(product.id).then((nowSaved) => {
                      notify({
                        title: nowSaved ? 'Saved to wishlist' : 'Removed from wishlist',
                        description: product.name,
                      });
                    });
                  }}
                >
                  {saved ? 'Saved' : 'Save'}
                </Button>
              </div>
            ) : (
              <div className="mt-7 rounded-[12px] border border-signal-red/25 bg-signal-red/[0.05] p-4">
                <p className="text-[14px] font-medium text-signal-red">Currently unavailable</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-void-300">
                  The current batch is fully allocated. {product.deliveryEstimate}.
                </p>
                <ButtonLink to={ROUTES.catalog} size="sm" variant="secondary" className="mt-4">
                  See alternatives
                </ButtonLink>
              </div>
            )}

            <ul className="mt-8 grid list-none gap-3 p-0 sm:grid-cols-2">
              <li className="flex gap-3 rounded-[11px] border border-white/7 bg-void-900/40 p-3.5">
                <Zap aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-500" />
                <div>
                  <p className="text-[13px] text-void-50">Delivery</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-void-400">
                    {product.deliveryEstimate}
                  </p>
                </div>
              </li>
              <li className="flex gap-3 rounded-[11px] border border-white/7 bg-void-900/40 p-3.5">
                <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-500" />
                <div>
                  <p className="text-[13px] text-void-50">Payment</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-void-400">
                    Confirmed on-chain before issuance
                  </p>
                </div>
              </li>
            </ul>

            <dl className="mt-10 space-y-6">
              <div>
                <dt className="mono-label mb-2">Where it can be used</dt>
                <dd className="text-[13.5px] leading-relaxed text-void-200">
                  {product.redemptionChannels.join(' · ')}
                </dd>
              </div>
              <div>
                <dt className="mono-label mb-2">Supported regions</dt>
                <dd className="text-[13.5px] leading-relaxed text-void-200">
                  {product.usageRegions.join(' · ')}
                </dd>
              </div>
              <div>
                <dt className="mono-label mb-2">Terms</dt>
                <dd className="max-w-xl text-[13px] leading-relaxed text-void-300">
                  {product.terms}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>

      {related.data && related.data.length > 0 && (
        <Container>
          <section aria-labelledby="related-heading" className="border-t border-white/7 pt-14">
            <h2 id="related-heading" className="text-xl">
              More in {product.categoryName}
            </h2>
            <ProductGrid className="mt-8" products={related.data} />
          </section>
        </Container>
      )}
    </Page>
  );
}
