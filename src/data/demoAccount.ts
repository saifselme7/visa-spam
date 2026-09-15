import type { OrderItemRow, OrderRow, ProfileRow } from '@/types/database';

/**
 * Fixture account used ONLY when VITE_DEMO_MODE=true.
 * The password is a well-known placeholder so the UI can be exercised without
 * a backend — it grants access to nothing but local mock data.
 */
export const DEMO_CREDENTIALS = {
  email: 'demo.user@gmail.com',
  password: 'voidcard-demo',
} as const;

export const DEMO_USER_ID = 'u0000000-0000-4000-8000-000000000001';

export const demoProfileRow: ProfileRow = {
  id: DEMO_USER_ID,
  email: DEMO_CREDENTIALS.email,
  display_name: 'Demo User',
  avatar_url: null,
  role: 'customer',
  preferences: {
    currency: 'USD',
    preferred_asset: 'USDT',
    order_email_updates: true,
    reduced_motion: null,
  },
  marketing_opt_in: false,
  created_at: '2026-01-12T14:04:00.000Z',
  updated_at: '2026-08-30T09:11:00.000Z',
};

const item = (
  n: number,
  orderId: string,
  productN: number,
  name: string,
  slug: string,
  face: number,
  unit: number,
  qty: number,
): OrderItemRow => ({
  id: `oi000000-0000-4000-8000-${String(n).padStart(12, '0')}`,
  order_id: orderId,
  product_id: `p0000000-0000-4000-8000-${String(productN).padStart(12, '0')}`,
  product_name: name,
  product_slug: slug,
  face_value_cents: face * 100,
  unit_price_cents: Math.round(unit * 100),
  quantity: qty,
  total_cents: Math.round(unit * 100) * qty,
  created_at: '2026-06-02T10:00:00.000Z',
});

const ORDER_1 = 'o0000000-0000-4000-8000-000000000001';
const ORDER_2 = 'o0000000-0000-4000-8000-000000000002';
const ORDER_3 = 'o0000000-0000-4000-8000-000000000003';

export const demoOrderRows: OrderRow[] = [
  {
    id: ORDER_1,
    user_id: DEMO_USER_ID,
    reference: 'VC-4K8ZQ2',
    subtotal_cents: 40000,
    discount_cents: 2200,
    total_cents: 37800,
    currency: 'USD',
    order_status: 'completed',
    payment_status: 'paid',
    contact_email: DEMO_CREDENTIALS.email,
    note: null,
    created_at: '2026-06-02T10:02:00.000Z',
    updated_at: '2026-06-02T10:26:00.000Z',
  },
  {
    id: ORDER_2,
    user_id: DEMO_USER_ID,
    reference: 'VC-9TR3MD',
    subtotal_cents: 10000,
    discount_cents: 500,
    total_cents: 9500,
    currency: 'USD',
    order_status: 'preparing',
    payment_status: 'paid',
    contact_email: DEMO_CREDENTIALS.email,
    note: null,
    created_at: '2026-09-09T18:40:00.000Z',
    updated_at: '2026-09-09T18:52:00.000Z',
  },
  {
    id: ORDER_3,
    user_id: DEMO_USER_ID,
    reference: 'VC-2QW7LP',
    subtotal_cents: 5000,
    discount_cents: 300,
    total_cents: 4700,
    currency: 'USD',
    order_status: 'cancelled',
    payment_status: 'expired',
    contact_email: DEMO_CREDENTIALS.email,
    note: 'Payment window elapsed before funds were detected.',
    created_at: '2026-08-21T21:15:00.000Z',
    updated_at: '2026-08-21T21:46:00.000Z',
  },
];

export const demoOrderItemRows: OrderItemRow[] = [
  item(1, ORDER_1, 3, 'VOIDCARD Prepaid 200', 'voidcard-prepaid-200', 200, 189, 2),
  item(2, ORDER_2, 2, 'VOIDCARD Prepaid 100', 'voidcard-prepaid-100', 100, 95, 1),
  item(3, ORDER_3, 1, 'VOIDCARD Prepaid 50', 'voidcard-prepaid-50', 50, 47, 1),
];

/** Product ids pre-populating the demo wishlist. */
export const demoWishlistProductIds = [
  'p0000000-0000-4000-8000-000000000004',
  'p0000000-0000-4000-8000-000000000014',
];
