import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useAsync } from '@/hooks/useAsync';
import { useSeo } from '@/hooks/useSeo';
import { productService } from '@/services/products';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { ProductGrid } from '@/components/cards/ProductGrid';
import { ProductGridSkeleton } from '@/components/cards/ProductCardSkeleton';
import { SearchBar } from '@/components/navigation/SearchBar';

const SUGGESTED_TERMS = ['prepaid', '100', 'gaming', 'streaming', 'travel'];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const term = params.get('q') ?? '';

  useSeo({
    title: term ? `Search: ${term}` : 'Search',
    description: 'Search VOIDCARD for prepaid and gift card denominations by name, brand or value.',
    path: term ? `${ROUTES.search}?q=${encodeURIComponent(term)}` : ROUTES.search,
    noIndex: true,
  });

  const query = useMemo(() => ({ search: term, pageSize: 24 }), [term]);
  const results = useAsync(
    () =>
      term.trim()
        ? productService().listProducts(query)
        : Promise.resolve({
            ok: true as const,
            data: { items: [], total: 0, page: 1, pageSize: 24, pageCount: 1 },
          }),
    [term, query],
  );

  const categories = useAsync(() => productService().listCategories(), []);

  const matchingCategories = useMemo(() => {
    if (!categories.data || !term.trim()) return [];
    const needle = term.trim().toLowerCase();
    return categories.data.filter(
      (category) =>
        category.name.toLowerCase().includes(needle) ||
        category.description.toLowerCase().includes(needle),
    );
  }, [categories.data, term]);

  return (
    <Page atmosphere="catalog">
      <Container size="narrow" className="pt-14 pb-10">
        <h1 className="text-[28px] leading-tight sm:text-[34px]">Search</h1>
        <p className="mt-3 text-[15px] text-void-300">
          Search by product name, brand, category or denomination.
        </p>
        <div className="mt-7">
          <SearchBar
            variant="inline"
            initialValue={term}
            autoFocus={!term}
            onChange={(value) => {
              if (value.trim() === '') setParams({}, { replace: true });
            }}
          />
        </div>
      </Container>

      <Container>
        {!term.trim() ? (
          <div className="rounded-[14px] border border-white/7 bg-void-900/40 p-8">
            <p className="mono-label mb-4">Try searching for</p>
            <ul className="flex list-none flex-wrap gap-2 p-0">
              {SUGGESTED_TERMS.map((suggestion) => (
                <li key={suggestion}>
                  <Link
                    to={`${ROUTES.search}?q=${encodeURIComponent(suggestion)}`}
                    className="inline-flex h-9 items-center rounded-[9px] border border-white/9 px-3.5 text-[13px] text-void-200 transition-colors hover:border-white/20 hover:text-void-50"
                  >
                    {suggestion}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            {matchingCategories.length > 0 && (
              <section aria-labelledby="category-results" className="mb-10">
                <h2 id="category-results" className="mono-label mb-3">
                  Categories
                </h2>
                <ul className="flex list-none flex-wrap gap-2 p-0">
                  {matchingCategories.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={ROUTES.catalog}
                        className="inline-flex h-9 items-center rounded-[9px] border border-accent-500/30 bg-accent-500/8 px-3.5 text-[13px] text-accent-400"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="product-results">
              <h2 id="product-results" className="mono-label mb-5" aria-live="polite">
                {results.data
                  ? `${results.data.total} ${results.data.total === 1 ? 'result' : 'results'} for “${term}”`
                  : 'Searching'}
              </h2>

              {results.loading && <ProductGridSkeleton count={3} />}
              {results.error && <ErrorState error={results.error} onRetry={results.reload} />}

              {results.data && results.data.items.length === 0 && (
                <EmptyState
                  icon={<SearchX />}
                  title={`Nothing matches “${term}”`}
                  description="Check the spelling, or try a broader term like a brand or a denomination."
                  action={
                    <ul className="flex list-none flex-wrap justify-center gap-2 p-0">
                      {SUGGESTED_TERMS.map((suggestion) => (
                        <li key={suggestion}>
                          <Link
                            to={`${ROUTES.search}?q=${encodeURIComponent(suggestion)}`}
                            className="inline-flex h-8 items-center rounded-[8px] border border-white/9 px-3 text-[12.5px] text-void-200 hover:text-void-50"
                          >
                            {suggestion}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  }
                />
              )}

              {results.data && results.data.items.length > 0 && (
                <ProductGrid products={results.data.items} />
              )}
            </section>
          </>
        )}
      </Container>
    </Page>
  );
}
