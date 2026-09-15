import type {
  CategoryRow,
  InventoryRow,
  OrderItemRow,
  OrderRow,
  PaymentRow,
  ProductRow,
  ProfileRow,
  SupportTicketRow,
} from '@/types/database';
import type {
  Category,
  Order,
  OrderItem,
  PaymentIntent,
  Product,
  SupportTicket,
  UserProfile,
} from '@/types/domain';
import { fromCents } from '@/utils/format';

/** Row -> domain mapping. The only place snake_case is allowed to leak. */

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? '',
    position: row.position,
  };
}

export function mapProduct(
  row: ProductRow,
  category: CategoryRow | undefined,
  inventory: InventoryRow | undefined,
): Product {
  const faceValue = fromCents(row.face_value_cents);
  const price = fromCents(row.price_cents);
  const savings = Math.max(0, faceValue - price);
  return {
    id: row.id,
    slug: row.slug,
    categoryId: row.category_id,
    categorySlug: category?.slug ?? 'uncategorised',
    categoryName: category?.name ?? 'Uncategorised',
    name: row.name,
    brand: row.brand,
    faceValue,
    price,
    currency: row.currency,
    savings,
    discountPercent: faceValue > 0 ? Math.round((savings / faceValue) * 100) : 0,
    availability: row.availability,
    featured: row.featured,
    shortDescription: row.short_description,
    description: row.description,
    terms: row.terms,
    usageRegions: row.usage_regions,
    redemptionChannels: row.redemption_channels,
    deliveryEstimate: row.delivery_estimate,
    art: {
      theme: row.art.theme,
      network: row.art.network,
      maskedNumber: row.art.masked_number,
    },
    stock: inventory?.quantity_available ?? null,
    updatedAt: row.updated_at,
  };
}

export function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name ?? row.email.split('@')[0],
    role: row.role,
    createdAt: row.created_at,
    marketingOptIn: row.marketing_opt_in,
    preferences: {
      currency: row.preferences.currency,
      preferredAsset: row.preferences.preferred_asset,
      orderEmailUpdates: row.preferences.order_email_updates,
    },
  };
}

export function mapOrderItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    productSlug: row.product_slug,
    faceValue: fromCents(row.face_value_cents),
    unitPrice: fromCents(row.unit_price_cents),
    quantity: row.quantity,
    total: fromCents(row.total_cents),
  };
}

export function mapOrder(
  row: OrderRow,
  items: OrderItemRow[],
  paymentMethod: Order['paymentMethod'] = null,
): Order {
  return {
    id: row.id,
    reference: row.reference,
    userId: row.user_id,
    items: items.map(mapOrderItem),
    subtotal: fromCents(row.subtotal_cents),
    discount: fromCents(row.discount_cents),
    total: fromCents(row.total_cents),
    currency: row.currency,
    paymentMethod,
    paymentStatus: row.payment_status,
    orderStatus: row.order_status,
    contactEmail: row.contact_email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapPaymentIntent(row: PaymentRow, orderReference: string): PaymentIntent {
  return {
    id: row.id,
    orderId: row.order_id,
    orderReference,
    method: row.method,
    network: row.network,
    status: row.status,
    amount: fromCents(row.amount_cents),
    currency: row.currency,
    cryptoAmount: row.crypto_amount,
    depositAddress: row.deposit_address,
    provider: row.provider,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

export function mapSupportTicket(row: SupportTicketRow): SupportTicket {
  return {
    id: row.id,
    reference: row.reference,
    email: row.email,
    category: row.category,
    priority: row.priority,
    status: row.status,
    subject: row.subject,
    message: row.message,
    orderReference: row.order_reference,
    createdAt: row.created_at,
  };
}
