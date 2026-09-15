/**
 * Placeholder implementation for the Supabase-backed catalogue.
 *
 * Kept as a compiling stub so the wiring is obvious: each method maps 1:1 to a
 * query against `products` joined with `categories` and `inventory`, and the
 * rows are converted with `mapProduct` / `mapCategory` from `services/mappers`.
 * Products are world-readable (`status = 'active'`) under RLS; writes belong to
 * an admin role only.
 */
import type { Paginated, Product, ProductQuery } from '@/types/domain';
import { fail, type Result } from '@/types/result';
import type { ProductService } from './types';

const NOT_IMPLEMENTED = 'The catalogue backend is not connected yet.';

export class SupabaseProductService implements ProductService {
  async listCategories() {
    // supabase.from('categories').select('*').order('position')
    return fail<never[]>('not_configured', NOT_IMPLEMENTED);
  }

  async listProducts(_query: ProductQuery = {}): Promise<Result<Paginated<Product>>> {
    void _query;
    // supabase.from('products').select('*, categories(*), inventory(*)', { count: 'exact' })
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async getProduct(_slugOrId: string): Promise<Result<Product>> {
    void _slugOrId;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async getProductsByIds(_ids: string[]): Promise<Result<Product[]>> {
    void _ids;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async listFeatured(_limit?: number): Promise<Result<Product[]>> {
    void _limit;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async listDeals(_limit?: number): Promise<Result<Product[]>> {
    void _limit;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async suggest(_term: string, _limit?: number): Promise<Result<Product[]>> {
    void _term;
    void _limit;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async getPriceRange(): Promise<Result<{ min: number; max: number }>> {
    return fail('not_configured', NOT_IMPLEMENTED);
  }
}
