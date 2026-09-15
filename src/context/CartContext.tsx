import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { STORAGE_KEYS } from '@/config/site';
import type { CartLine, CartTotals, Product } from '@/types/domain';
import { readJson, writeJson } from '@/utils/storage';

/**
 * Cart state.
 *
 * Persistence sits behind `persist()` so the same reducer can later be backed
 * by a Supabase `carts` table (or merged into one on sign-in) without the UI
 * noticing. Prices held here are display values only — the server re-prices
 * every line when the order is created.
 */

const MAX_QUANTITY_PER_LINE = 10;

type CartAction =
  | { type: 'hydrate'; lines: CartLine[] }
  | { type: 'add'; product: Product; quantity: number }
  | { type: 'remove'; productId: string }
  | { type: 'setQuantity'; productId: string; quantity: number }
  | { type: 'clear' };

function reducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'hydrate':
      return action.lines;

    case 'add': {
      const { product, quantity } = action;
      const existing = state.find((line) => line.productId === product.id);
      if (existing) {
        return state.map((line) =>
          line.productId === product.id
            ? {
                ...line,
                quantity: Math.min(MAX_QUANTITY_PER_LINE, line.quantity + quantity),
              }
            : line,
        );
      }
      return [
        ...state,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          faceValue: product.faceValue,
          unitPrice: product.price,
          quantity: Math.min(MAX_QUANTITY_PER_LINE, Math.max(1, quantity)),
          theme: product.art.theme,
          currency: product.currency,
        },
      ];
    }

    case 'remove':
      return state.filter((line) => line.productId !== action.productId);

    case 'setQuantity': {
      if (action.quantity <= 0) {
        return state.filter((line) => line.productId !== action.productId);
      }
      return state.map((line) =>
        line.productId === action.productId
          ? { ...line, quantity: Math.min(MAX_QUANTITY_PER_LINE, action.quantity) }
          : line,
      );
    }

    case 'clear':
      // Returning the same reference when already empty keeps `clear()`
      // idempotent, so callers can invoke it from an effect without looping.
      return state.length === 0 ? state : [];

    default:
      return state;
  }
}

export interface CartContextValue {
  lines: CartLine[];
  totals: CartTotals;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
  maxQuantity: number;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, [] as CartLine[]);

  useEffect(() => {
    const stored = readJson<CartLine[]>(STORAGE_KEYS.cart, []);
    if (stored.length > 0) dispatch({ type: 'hydrate', lines: stored });
  }, []);

  useEffect(() => {
    writeJson(STORAGE_KEYS.cart, lines);
  }, [lines]);

  const totals = useMemo<CartTotals>(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.faceValue * line.quantity, 0);
    const total = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    return {
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round((subtotal - total) * 100) / 100,
      total: Math.round(total * 100) / 100,
      currency: lines[0]?.currency ?? 'USD',
    };
  }, [lines]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: 'add', product, quantity });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'remove', productId });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'setQuantity', productId, quantity });
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const find = (productId: string) => lines.find((line) => line.productId === productId);
    return {
      lines,
      totals,
      addItem,
      removeItem,
      setQuantity,
      increment: (productId) => {
        const line = find(productId);
        if (line) setQuantity(productId, line.quantity + 1);
      },
      decrement: (productId) => {
        const line = find(productId);
        if (line) setQuantity(productId, line.quantity - 1);
      },
      clear: () => {
        dispatch({ type: 'clear' });
      },
      has: (productId) => lines.some((line) => line.productId === productId),
      maxQuantity: MAX_QUANTITY_PER_LINE,
    };
  }, [lines, totals, addItem, removeItem, setQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
