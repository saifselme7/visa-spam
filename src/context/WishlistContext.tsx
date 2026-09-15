import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { wishlistService } from '@/services/wishlist';
import type { WishlistEntry } from '@/types/domain';

export interface WishlistContextValue {
  entries: WishlistEntry[];
  ids: Set<string>;
  isSaved: (productId: string) => boolean;
  toggle: (productId: string) => Promise<boolean>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  loading: boolean;
}

export const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const service = useMemo(() => wishlistService(), []);
  const [entries, setEntries] = useState<WishlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void service.list().then((result) => {
      if (!active) return;
      if (result.ok) setEntries(result.data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [service]);

  const ids = useMemo(() => new Set(entries.map((entry) => entry.productId)), [entries]);

  const toggle = useCallback(
    async (productId: string) => {
      const saved = ids.has(productId);
      const result = saved ? await service.remove(productId) : await service.add(productId);
      if (result.ok) setEntries(result.data);
      return !saved;
    },
    [ids, service],
  );

  const remove = useCallback(
    async (productId: string) => {
      const result = await service.remove(productId);
      if (result.ok) setEntries(result.data);
    },
    [service],
  );

  const clear = useCallback(async () => {
    const result = await service.clear();
    if (result.ok) setEntries(result.data);
  }, [service]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      entries,
      ids,
      isSaved: (productId: string) => ids.has(productId),
      toggle,
      remove,
      clear,
      loading,
    }),
    [entries, ids, toggle, remove, clear, loading],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
