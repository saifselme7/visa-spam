/**
 * Domain models consumed by the UI.
 *
 * The UI never imports database row types directly — services map rows to
 * these camelCase models, which keeps Supabase (or any other backend) an
 * implementation detail.
 */
import type {
  AvailabilityState,
  CryptoAsset,
  CurrencyCode,
  OrderStatus,
  PaymentStatus,
  ProductArtJson,
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
  Timestamp,
  UUID,
  UserRole,
} from './database';

export type {
  AvailabilityState,
  CryptoAsset,
  CurrencyCode,
  OrderStatus,
  PaymentStatus,
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
  UserRole,
};

export type CardTheme = ProductArtJson['theme'];

export interface Category {
  id: UUID;
  slug: string;
  name: string;
  description: string;
  position: number;
}

export interface Product {
  id: UUID;
  slug: string;
  categoryId: UUID;
  categorySlug: string;
  categoryName: string;
  name: string;
  brand: string;
  /** Face value in major units (e.g. 200 === $200.00). */
  faceValue: number;
  /** Sale price in major units. */
  price: number;
  currency: CurrencyCode;
  /** faceValue - price, never negative. */
  savings: number;
  /** 0–100, rounded. */
  discountPercent: number;
  availability: AvailabilityState;
  featured: boolean;
  shortDescription: string;
  description: string;
  terms: string;
  usageRegions: string[];
  redemptionChannels: string[];
  deliveryEstimate: string;
  art: {
    theme: CardTheme;
    network: string;
    maskedNumber: string;
  };
  stock: number | null;
  updatedAt: Timestamp;
}

export interface UserProfile {
  id: UUID;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Timestamp;
  marketingOptIn: boolean;
  preferences: {
    currency: CurrencyCode;
    preferredAsset: CryptoAsset;
    orderEmailUpdates: boolean;
  };
}

export interface AuthSession {
  user: UserProfile;
  /** Present only so the UI can show session state; never a real secret in demo mode. */
  expiresAt: Timestamp;
  /** Which implementation produced this session. */
  source: 'demo' | 'supabase';
}

export interface CartLine {
  productId: UUID;
  slug: string;
  name: string;
  faceValue: number;
  unitPrice: number;
  quantity: number;
  theme: CardTheme;
  currency: CurrencyCode;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  currency: CurrencyCode;
}

export interface OrderItem {
  id: UUID;
  productId: UUID;
  productName: string;
  productSlug: string;
  faceValue: number;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: UUID;
  reference: string;
  userId: UUID;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: CurrencyCode;
  paymentMethod: CryptoAsset | null;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  contactEmail: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PaymentMethod {
  asset: CryptoAsset;
  name: string;
  network: string;
  /** Informational only — real quotes come from the provider. */
  confirmationsRequired: number;
  estimatedSettlement: string;
  enabled: boolean;
}

export interface PaymentIntent {
  id: UUID;
  orderId: UUID;
  orderReference: string;
  method: CryptoAsset;
  network: string;
  status: PaymentStatus;
  amount: number;
  currency: CurrencyCode;
  /** Decimal string quoted by the provider; null until the provider responds. */
  cryptoAmount: string | null;
  /**
   * Provider-issued deposit address. In demo mode this is always null and the
   * UI renders an explicit "issued by provider" placeholder instead.
   */
  depositAddress: string | null;
  provider: string;
  expiresAt: Timestamp | null;
  createdAt: Timestamp;
}

export interface PaymentTransaction {
  id: UUID;
  paymentId: UUID;
  status: PaymentStatus;
  reference: string | null;
  confirmations: number;
  requiredConfirmations: number;
  source: 'provider_webhook' | 'edge_function' | 'manual_review' | 'demo_simulation';
  createdAt: Timestamp;
}

export interface WishlistEntry {
  productId: UUID;
  addedAt: Timestamp;
}

export interface SupportTicket {
  id: UUID;
  reference: string;
  email: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  subject: string;
  message: string;
  orderReference: string | null;
  createdAt: Timestamp;
}

export interface SupportTicketDraft {
  email: string;
  category: SupportTicketCategory;
  subject: string;
  message: string;
  orderReference?: string | null;
  priority?: SupportTicketPriority;
}

/* ---------------------------------- query --------------------------------- */

export type ProductSort =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'discount-desc'
  | 'value-desc'
  | 'name-asc';

export interface ProductQuery {
  search?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  availability?: AvailabilityState[];
  featuredOnly?: boolean;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}
