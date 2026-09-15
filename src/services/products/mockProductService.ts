import { categoryRows } from '@/data/categories';
import { inventoryRows, productRows } from '@/data/products';
import { mapCategory, mapProduct } from '@/services/mappers';
import { NETWORK_SIMULATION_MS, delay } from '@/services/latency';
import type { Paginated, Product, ProductQuery, ProductSort } from '@/types/domain';
import { fail, ok, type Result } from '@/types/result';
import type { ProductService } from './types';

const categoryById = new Map(categoryRows.map((row) => [row.id, row]));
const inventoryByProduct = new Map(inventoryRows.map((row) => [row.product_id, row]));

const catalogue: Product[] = productRows
  .filter((row) => row.status === 'active')
  .map((row) => mapProduct(row, categoryById.get(row.category_id), inventoryByProduct.get(row.id)));

const AVAILABILITY_WEIGHT: Record<Product['availability'], number> = {
  in_stock: 0,
  low_stock: 1,
  preorder: 2,
  sold_out: 3,
};

function matches(product: Product, query: ProductQuery): boolean {
  if (query.featuredOnly && !product.featured) return false;

  if (query.categories?.length && !query.categories.includes(product.categorySlug)) return false;

  if (query.minPrice !== undefined && product.price < query.minPrice) return false;
  if (query.maxPrice !== undefined && product.price > query.maxPrice) return false;
  if (query.minDiscount !== undefined && product.discountPercent < query.minDiscount) return false;

  if (query.availability?.length && !query.availability.includes(product.availability)) {
    return false;
  }

  const term = query.search?.trim().toLowerCase();
  if (term) {
    const haystack = [
      product.name,
      product.brand,
      product.categoryName,
      product.shortDescription,
      String(product.faceValue),
    ]
      .join(' ')
      .toLowerCase();
    if (!term.split(/\s+/).every((word) => haystack.includes(word))) return false;
  }

  return true;
}

function compare(sort: ProductSort): (a: Product, b: Product) => number {
  switch (sort) {
    case 'price-asc':
      return (a, b) => a.price - b.price;
    case 'price-desc':
      return (a, b) => b.price - a.price;
    case 'discount-desc':
      return (a, b) => b.discountPercent - a.discountPercent || a.price - b.price;
    case 'value-desc':
      return (a, b) => b.faceValue - a.faceValue;
    case 'name-asc':
      return (a, b) => a.name.localeCompare(b.name);
    case 'featured':
    default:
      return (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        AVAILABILITY_WEIGHT[a.availability] - AVAILABILITY_WEIGHT[b.availability] ||
        b.discountPercent - a.discountPercent;
  }
}

/**
 * In-memory catalogue backed by `src/data`. Swap for `SupabaseProductService`
 * by changing the factory in `services/products/index.ts`.
 */
export class MockProductService implements ProductService {
  async listCategories() {
    await delay(NETWORK_SIMULATION_MS);
    return ok([...categoryRows].sort((a, b) => a.position - b.position).map(mapCategory));
  }

  async listProducts(query: ProductQuery = {}): Promise<Result<Paginated<Product>>> {
    await delay(NETWORK_SIMULATION_MS);
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.max(1, Math.min(48, query.pageSize ?? 12));

    const filtered = catalogue.filter((product) => matches(product, query));
    filtered.sort(compare(query.sort ?? 'featured'));

    const total = filtered.length;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, pageCount);
    const start = (safePage - 1) * pageSize;

    return ok({
      items: filtered.slice(start, start + pageSize),
      total,
      page: safePage,
      pageSize,
      pageCount,
    });
  }

  async getProduct(slugOrId: string): Promise<Result<Product>> {
    await delay(NETWORK_SIMULATION_MS);
    const product = catalogue.find((item) => item.slug === slugOrId || item.id === slugOrId);
    if (!product) {
      return fail('not_found', 'We couldn’t find that card. It may have been retired.');
    }
    return ok(product);
  }

  async getProductsByIds(ids: string[]): Promise<Result<Product[]>> {
    await delay(NETWORK_SIMULATION_MS);
    const wanted = new Set(ids);
    return ok(catalogue.filter((product) => wanted.has(product.id)));
  }

  async listFeatured(limit = 4): Promise<Result<Product[]>> {
    await delay(NETWORK_SIMULATION_MS);
    return ok(catalogue.filter((product) => product.featured).slice(0, limit));
  }

  async listDeals(limit = 8): Promise<Result<Product[]>> {
    await delay(NETWORK_SIMULATION_MS);
    return ok(
      [...catalogue]
        .filter((product) => product.discountPercent > 0 && product.availability !== 'sold_out')
        .sort((a, b) => b.savings - a.savings)
        .slice(0, limit),
    );
  }

  async suggest(term: string, limit = 6): Promise<Result<Product[]>> {
    const trimmed = term.trim();
    if (!trimmed) return ok([]);
    const result = await this.listProducts({ search: trimmed, pageSize: limit, sort: 'featured' });
    return result.ok ? ok(result.data.items) : result;
  }

  async getPriceRange(): Promise<Result<{ min: number; max: number }>> {
    const prices = catalogue.map((product) => product.price);
    return ok({
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    });
  }
}
