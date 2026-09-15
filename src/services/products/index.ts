import { backendMode } from '@/config/env';
import { MockProductService } from './mockProductService';
import { SupabaseProductService } from './supabaseProductService';
import type { ProductService } from './types';

export type { ProductService };

let instance: ProductService | null = null;

/** Single place that decides which catalogue implementation the app uses. */
export function productService(): ProductService {
  instance ??= backendMode === 'supabase' ? new SupabaseProductService() : new MockProductService();
  return instance;
}
