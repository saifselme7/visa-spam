import { useCallback, useMemo, useState } from 'react';
import { PackageSearch, SlidersHorizontal } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useAsync } from '@/hooks/useAsync';
import { useSeo } from '@/hooks/useSeo';
import { productService } from '@/services/products';
import type { ProductSort } from '@/types/domain';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductGrid } from '@/components/cards/ProductGrid';
import { ProductGridSkeleton } from '@/components/cards/ProductCardSkeleton';
import { SelectField } from '@/components/forms/SelectField';
import { EMPTY_FILTERS, FilterPanel, type CatalogFilters } from './FilterPanel';

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'discount-desc', label: 'Biggest discount' },
  { value: 'value-desc', label: 'Highest value' },
  { value: 'name-asc', label: 'Name A–Z' },
];

const PAGE_SIZE = 9;

export default function CatalogPage() {
  useSeo({
    title: 'Catalogue',
    description:
      'Browse every prepaid and gift card denomination available on VOIDCARD, with live pricing, discounts and availability.',
    path: ROUTES.catalog,
  });

  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<ProductSort>('featured');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = useAsync(() => productService().listCategories(), []);
  const priceRange = useAsync(() => productService().getPriceRange(), []);

  const query = useMemo(
    () => ({
      categories: filters.categories,
      maxPrice: filters.maxPrice ?? undefined,
      minDiscount: filters.minDiscount || undefined,
      availability: filters.availability.length > 0 ? filters.availability : undefined,
      sort,
      page,
      pageSize: PAGE_SIZE,
    }),
    [filters, sort, page],
  );

  const results = useAsync(() => productService().listProducts(query), [query]);

  const onFiltersChange = useCallback((next: CatalogFilters) => {
    setFilters(next);
    setPage(1);
  }, []);

  const range = priceRange.data ?? { min: 0, max: 500 };

  const filterPanel = categories.data ? (
    <FilterPanel
      categories={categories.data}
      filters={filters}
      priceRange={range}
      onChange={onFiltersChange}
    />
  ) : null;

  return (
    <Page atmosphere="catalog">
      <PageHeader
        eyebrow="Catalogue"
        title="Every card, one list"
        description="Filter by category, price and discount. Availability reflects the current issuance batch."
      />

      <Container>
        <div className="grid gap-10 lg:grid-cols-[228px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+24px)]">{filterPanel}</div>
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-void-300" aria-live="polite">
                {results.data
                  ? `${results.data.total} ${results.data.total === 1 ? 'product' : 'products'}`
                  : 'Loading products'}
              </p>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="lg:hidden"
                  iconLeft={<SlidersHorizontal />}
                  onClick={() => {
                    setFiltersOpen(true);
                  }}
                >
                  Filters
                </Button>

                <SelectField
                  label="Sort by"
                  hideLabel
                  options={SORT_OPTIONS}
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value as ProductSort);
                    setPage(1);
                  }}
                  className="h-9 w-[190px] text-[13px]"
                />
              </div>
            </div>

            {results.loading && <ProductGridSkeleton count={6} />}

            {results.error && <ErrorState error={results.error} onRetry={results.reload} />}

            {results.data && results.data.items.length === 0 && (
              <EmptyState
                icon={<PackageSearch />}
                title="No cards match these filters"
                description="Try widening the price range or clearing a category."
                action={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      onFiltersChange(EMPTY_FILTERS);
                    }}
                  >
                    Clear filters
                  </Button>
                }
              />
            )}

            {results.data && results.data.items.length > 0 && (
              <>
                <ProductGrid products={results.data.items} columnsClassName="sm:grid-cols-2 2xl:grid-cols-3" />

                {results.data.pageCount > 1 && (
                  <nav
                    aria-label="Pagination"
                    className="mt-10 flex items-center justify-between gap-4 border-t border-white/7 pt-6"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={results.data.page <= 1}
                      onClick={() => {
                        setPage((current) => Math.max(1, current - 1));
                      }}
                    >
                      Previous
                    </Button>
                    <p className="text-[13px] text-void-300 tabular">
                      Page {results.data.page} of {results.data.pageCount}
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={results.data.page >= results.data.pageCount}
                      onClick={() => {
                        setPage((current) => current + 1);
                      }}
                    >
                      Next
                    </Button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </Container>

      <Drawer
        open={filtersOpen}
        onClose={() => {
          setFiltersOpen(false);
        }}
        title="Filters"
        side="left"
        footer={
          <Button
            fullWidth
            onClick={() => {
              setFiltersOpen(false);
            }}
          >
            Show results
          </Button>
        }
      >
        {filterPanel}
      </Drawer>
    </Page>
  );
}
