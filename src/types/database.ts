/**
 * Future Supabase (PostgreSQL) schema, expressed as TypeScript.
 *
 * These types intentionally mirror the shape of the planned database tables so
 * that the service layer can be swapped from mock -> Supabase without the UI
 * having to change. Column names use snake_case to match Postgres; the domain
 * layer (see `domain.ts`) exposes camelCase objects to the UI.
 *
 * NOTHING secret belongs here. No service-role keys, no provider secrets,
 * no wallet private keys. Those live server-side only.
 */

export type UUID = string;
/** ISO-8601 timestamp string, e.g. 2026-01-04T10:22:31.000Z */
export type Timestamp = string;

export type CurrencyCode = 'USD' | 'EUR' | 'GBP';
export type CryptoAsset = 'USDT' | 'USDC' | 'BTC' | 'ETH';

export type UserRole = 'customer' | 'support' | 'admin';

export type ProductStatus = 'draft' | 'active' | 'archived';
export type AvailabilityState = 'in_stock' | 'low_stock' | 'preorder' | 'sold_out';

export type OrderStatus =
  | 'pending'
  | 'payment_processing'
  | 'paid'
  | 'preparing'
  | 'completed'
  | 'cancelled'
  | 'failed'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'expired'
  | 'cancelled';

export type SupportTicketStatus = 'open' | 'pending_customer' | 'resolved' | 'closed';
export type SupportTicketCategory = 'order' | 'payment' | 'account' | 'product' | 'other';
export type SupportTicketPriority = 'low' | 'normal' | 'high';

/** public.profiles — 1:1 with auth.users */
export interface ProfileRow {
  id: UUID; // references auth.users.id
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  /** User-facing preferences; free-form but typed at the domain layer. */
  preferences: ProfilePreferencesJson;
  marketing_opt_in: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ProfilePreferencesJson {
  currency: CurrencyCode;
  preferred_asset: CryptoAsset;
  order_email_updates: boolean;
  reduced_motion: boolean | null;
}

/** public.categories */
export interface CategoryRow {
  id: UUID;
  slug: string;
  name: string;
  description: string | null;
  /** Ordering weight for merchandising. */
  position: number;
  created_at: Timestamp;
}

/** public.products */
export interface ProductRow {
  id: UUID;
  slug: string;
  category_id: UUID;
  name: string;
  brand: string;
  /** Face value of the prepaid card, in minor units (cents). */
  face_value_cents: number;
  /** What the customer pays, in minor units (cents). */
  price_cents: number;
  currency: CurrencyCode;
  status: ProductStatus;
  availability: AvailabilityState;
  featured: boolean;
  short_description: string;
  description: string;
  terms: string;
  usage_regions: string[];
  redemption_channels: string[];
  /** Visual identity for the 3D card renderer (no real credentials). */
  art: ProductArtJson;
  delivery_estimate: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ProductArtJson {
  /** Palette key resolved by the DigitalCard component. */
  theme: 'graphite' | 'obsidian' | 'titanium' | 'aurora' | 'copper' | 'ice';
  /** Fictional network label printed on the demo card face. */
  network: string;
  /** Always a masked, non-usable placeholder. */
  masked_number: string;
}

/** public.inventory — separated so stock can be managed without touching products */
export interface InventoryRow {
  product_id: UUID;
  /** Null means "unlimited / on demand issuance". */
  quantity_available: number | null;
  reserved: number;
  restock_expected_at: Timestamp | null;
  updated_at: Timestamp;
}

/** public.orders */
export interface OrderRow {
  id: UUID;
  /** Owner. RLS: user_id = auth.uid(). Never accepted from the client. */
  user_id: UUID;
  reference: string; // human-facing, e.g. VC-8F3K2Q
  subtotal_cents: number;
  discount_cents: number;
  total_cents: number;
  currency: CurrencyCode;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  contact_email: string;
  note: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** public.order_items */
export interface OrderItemRow {
  id: UUID;
  order_id: UUID;
  product_id: UUID;
  /** Denormalised so historic orders survive product edits. */
  product_name: string;
  product_slug: string;
  face_value_cents: number;
  unit_price_cents: number;
  quantity: number;
  total_cents: number;
  created_at: Timestamp;
}

/** public.payments — one payment intent per attempt on an order */
export interface PaymentRow {
  id: UUID;
  order_id: UUID;
  user_id: UUID;
  method: CryptoAsset;
  network: string; // e.g. 'TRC20', 'ERC20', 'Bitcoin'
  status: PaymentStatus;
  /** Fiat amount owed at intent creation. */
  amount_cents: number;
  currency: CurrencyCode;
  /** Quoted crypto amount as a decimal string to avoid float drift. */
  crypto_amount: string | null;
  /**
   * Deposit address issued by the payment provider, server-side only.
   * Never hardcoded in the frontend, never a real address in demo mode.
   */
  deposit_address: string | null;
  provider: string; // e.g. 'demo', 'provider-x'
  provider_intent_id: string | null;
  expires_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/**
 * public.payment_transactions — append-only ledger written exclusively by the
 * backend/Edge Function after independent on-chain verification.
 * The browser can read these rows, never insert or update them.
 */
export interface PaymentTransactionRow {
  id: UUID;
  payment_id: UUID;
  order_id: UUID;
  status: PaymentStatus;
  /** Opaque provider/chain reference. Display only. */
  reference: string | null;
  confirmations: number;
  required_confirmations: number;
  observed_amount: string | null;
  /** Who/what wrote this row — always server-side. */
  source: 'provider_webhook' | 'edge_function' | 'manual_review';
  created_at: Timestamp;
}

/** public.wishlists */
export interface WishlistRow {
  id: UUID;
  user_id: UUID;
  name: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** public.wishlist_items */
export interface WishlistItemRow {
  id: UUID;
  wishlist_id: UUID;
  product_id: UUID;
  created_at: Timestamp;
}

/** public.support_tickets */
export interface SupportTicketRow {
  id: UUID;
  user_id: UUID | null;
  reference: string;
  email: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  subject: string;
  message: string;
  order_reference: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

/** public.site_settings — single-row config editable from a future /admin */
export interface SiteSettingsRow {
  id: UUID;
  maintenance_mode: boolean;
  checkout_enabled: boolean;
  supported_assets: CryptoAsset[];
  default_currency: CurrencyCode;
  support_email: string;
  announcement: string | null;
  updated_at: Timestamp;
}

/**
 * Convenience map describing the planned schema. Useful when generating
 * Supabase types later (`supabase gen types typescript`) — the generated
 * `Database` interface should structurally match this.
 */
export interface DatabaseTables {
  profiles: ProfileRow;
  categories: CategoryRow;
  products: ProductRow;
  inventory: InventoryRow;
  orders: OrderRow;
  order_items: OrderItemRow;
  payments: PaymentRow;
  payment_transactions: PaymentTransactionRow;
  wishlists: WishlistRow;
  wishlist_items: WishlistItemRow;
  support_tickets: SupportTicketRow;
  site_settings: SiteSettingsRow;
}
