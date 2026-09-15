import type { WishlistEntry } from '@/types/domain';
import type { Result } from '@/types/result';

export interface WishlistService {
  list(): Promise<Result<WishlistEntry[]>>;
  add(productId: string): Promise<Result<WishlistEntry[]>>;
  remove(productId: string): Promise<Result<WishlistEntry[]>>;
  clear(): Promise<Result<WishlistEntry[]>>;
  /**
   * Called after sign-in so a guest wishlist collected in localStorage can be
   * merged into the account's server-side list.
   */
  mergeLocal(entries: WishlistEntry[]): Promise<Result<WishlistEntry[]>>;
}
