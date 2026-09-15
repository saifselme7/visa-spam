import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useAsync } from '@/hooks/useAsync';
import { useSeo } from '@/hooks/useSeo';
import { productService } from '@/services/products';
import { formatMoney } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { PageHeader } from '@/components/layout/PageHeader';
import { DigitalCard } from '@/components/cards/DigitalCard';
import { AvailabilityTag } from '@/components/cards/AvailabilityTag';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';

export default function DealsPage() {
  useSeo({
    title: 'Deals',
    description:
      'Current discounts across VOIDCARD denominations — see the face value, the price you pay and the exact saving.',
    path: ROUTES.deals,
  });

  const { addItem } = useCart();
  const { notify } = useToast();
  const deals = useAsync(() => productService().listDeals(12), []);

  return (
    <Page atmosphere="deals">
      <PageHeader
        eyebrow="Deals"
        title="Every discount, listed plainly"
        description="Discounts are set per denomination and adjust as batches are issued. There are no countdown gimmicks here — when a deal ends, it simply leaves this page."
      />

      <Container>
        {deals.loading && (
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-52 rounded-[14px]" />
            ))}
          </div>
        )}

        {deals.error && <ErrorState error={deals.error} onRetry={deals.reload} />}

        {deals.data && deals.data.length === 0 && (
          <EmptyState
            icon={<Tag />}
            title="No active deals right now"
            description="Everything is at list price today. The catalogue is still open."
          />
        )}

        {deals.data && deals.data.length > 0 && (
          <ul className="grid list-none gap-5 p-0 md:grid-cols-2">
            {deals.data.map((product) => (
              <li key={product.id}>
                <article className="group relative flex h-full gap-5 overflow-hidden rounded-[14px] border border-white/8 bg-void-900/55 p-5 transition-colors hover:border-white/16">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_0%,rgba(224,169,77,0.07),transparent_60%)]"
                  />

                  <DigitalCard
                    theme={product.art.theme}
                    value={product.faceValue}
                    label={product.brand.toUpperCase()}
                    size="sm"
                    interactive={false}
                    glow={false}
                    className="relative hidden w-36 shrink-0 sm:block"
                  />

                  <div className="relative flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="mono-label mb-1.5">{product.categoryName}</p>
                        <h2 className="truncate text-[15px] font-medium">
                          <Link
                            to={ROUTES.product(product.slug)}
                            className="outline-none after:absolute after:inset-0 after:content-['']"
                          >
                            {product.name}
                          </Link>
                        </h2>
                      </div>
                      <AvailabilityTag state={product.availability} />
                    </div>

                    <div className="mt-4 flex items-baseline gap-3">
                      <span className="text-[15px] text-void-400 line-through tabular">
                        {formatMoney(product.faceValue, product.currency)}
                      </span>
                      <ArrowRight aria-hidden className="size-3.5 text-void-500" />
                      <span className="text-2xl font-medium text-void-50 tabular">
                        {formatMoney(product.price, product.currency)}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-accent-500/14 px-2 py-1 font-mono text-[11px] text-accent-400 tabular">
                        −{product.discountPercent}%
                      </span>
                      <span className="text-[12.5px] text-void-300">
                        You save {formatMoney(product.savings, product.currency)}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                      <p className="text-[12px] text-void-500">
                        Runs while the current batch lasts
                      </p>
                      <Button
                        size="sm"
                        className="relative z-10"
                        onClick={() => {
                          addItem(product, 1);
                          notify({
                            title: 'Added to cart',
                            description: product.name,
                            tone: 'success',
                          });
                        }}
                        disabled={product.availability === 'sold_out'}
                      >
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Page>
  );
}
