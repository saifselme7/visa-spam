import type { Category, Paginated, Product, ProductQuery } from '@/types/domain';
import type { Result } from '@/types/result';

/**
 * Contract every product backend must satisfy. The UI depends on this
 * interface only — never on Supabase or on the mock data module.
 */
export interface ProductService {
  listCategories(): Promise<Result<Category[]>>;
  listProducts(query?: ProductQuery): Promise<Result<Paginated<Product>>>;
  /** Accepts a slug or a UUID so URLs can stay human-readable. */
  getProduct(slugOrId: string): Promise<Result<Product>>;
  getProductsByIds(ids: string[]): Promise<Result<Product[]>>;
  listFeatured(limit?: number): Promise<Result<Product[]>>;
  listDeals(limit?: number): Promise<Result<Product[]>>;
  /** Lightweight suggestion feed for the search overlay. */
  suggest(term: string, limit?: number): Promise<Result<Product[]>>;
  /** Inclusive price bounds across the active catalogue, for filter UI. */
  getPriceRange(): Promise<Result<{ min: number; max: number }>>;
}
