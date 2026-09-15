import { STORAGE_KEYS } from '@/config/site';
import { demoWishlistProductIds } from '@/data/demoAccount';
import type { WishlistEntry } from '@/types/domain';
import { ok, type Result } from '@/types/result';
import { readJson, writeJson } from '@/utils/storage';
import type { WishlistService } from './types';

/**
 * localStorage-backed wishlist used before a user signs in (and in demo mode).
 * The same interface is implemented by a future Supabase version writing to
 * `wishlists` / `wishlist_items`, so the UI does not change.
 */
export class LocalWishlistService implements WishlistService {
  private read(): WishlistEntry[] {
    const stored = readJson<WishlistEntry[] | null>(STORAGE_KEYS.wishlist, null);
    if (stored) return stored;
    const seeded: WishlistEntry[] = demoWishlistProductIds.map((productId) => ({
      productId,
      addedAt: new Date().toISOString(),
    }));
    writeJson(STORAGE_KEYS.wishlist, seeded);
    return seeded;
  }

  private write(entries: WishlistEntry[]): WishlistEntry[] {
    writeJson(STORAGE_KEYS.wishlist, entries);
    return entries;
  }

  async list(): Promise<Result<WishlistEntry[]>> {
    return ok(this.read());
  }

  async add(productId: string): Promise<Result<WishlistEntry[]>> {
    const entries = this.read();
    if (entries.some((entry) => entry.productId === productId)) return ok(entries);
    return ok(this.write([{ productId, addedAt: new Date().toISOString() }, ...entries]));
  }

  async remove(productId: string): Promise<Result<WishlistEntry[]>> {
    return ok(this.write(this.read().filter((entry) => entry.productId !== productId)));
  }

  async clear(): Promise<Result<WishlistEntry[]>> {
    return ok(this.write([]));
  }

  async mergeLocal(entries: WishlistEntry[]): Promise<Result<WishlistEntry[]>> {
    const existing = this.read();
    const seen = new Set(existing.map((entry) => entry.productId));
    const merged = [...existing, ...entries.filter((entry) => !seen.has(entry.productId))];
    return ok(this.write(merged));
  }
}
