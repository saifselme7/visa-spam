import { LocalWishlistService } from './localWishlistService';
import type { WishlistService } from './types';

let instance: WishlistService | null = null;

/**
 * Always local for now. When Supabase lands, return a SupabaseWishlistService
 * for signed-in users and keep the local one for guests, merging on sign-in.
 */
export function wishlistService(): WishlistService {
  instance ??= new LocalWishlistService();
  return instance;
}

export type { WishlistService };
