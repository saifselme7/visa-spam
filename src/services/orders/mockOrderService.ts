import { STORAGE_KEYS } from '@/config/site';
import { demoOrderItemRows, demoOrderRows } from '@/data/demoAccount';
import { NETWORK_SIMULATION_MS, delay } from '@/services/latency';
import { mapOrder } from '@/services/mappers';
import { authService } from '@/services/auth/authService';
import type { OrderItemRow, OrderRow, OrderStatus, PaymentStatus } from '@/types/database';
import type { Order } from '@/types/domain';
import { fail, ok, type Result } from '@/types/result';
import { orderReference, uuid } from '@/utils/id';
import { toCents } from '@/utils/format';
import { readJson, writeJson } from '@/utils/storage';
import type { CreateOrderInput, OrderService } from './types';

interface OrderStore {
  orders: OrderRow[];
  items: OrderItemRow[];
}

function seed(): OrderStore {
  return { orders: [...demoOrderRows], items: [...demoOrderItemRows] };
}

function load(): OrderStore {
  const stored = readJson<OrderStore | null>(STORAGE_KEYS.orders, null);
  if (!stored || !Array.isArray(stored.orders)) {
    const fresh = seed();
    writeJson(STORAGE_KEYS.orders, fresh);
    return fresh;
  }
  return stored;
}

function save(store: OrderStore): void {
  writeJson(STORAGE_KEYS.orders, store);
}

/**
 * Local order book for demo mode. Ownership is still resolved from the session
 * rather than trusted from the caller, mirroring the RLS behaviour we expect
 * from Postgres later.
 */
export class MockOrderService implements OrderService {
  private async currentUserId(): Promise<string | null> {
    const session = await authService().getSession();
    return session.ok && session.data ? session.data.user.id : null;
  }

  private compose(store: OrderStore, row: OrderRow): Order {
    return mapOrder(
      row,
      store.items.filter((item) => item.order_id === row.id),
    );
  }

  async createOrder(input: CreateOrderInput): Promise<Result<Order>> {
    await delay(NETWORK_SIMULATION_MS + 240);

    const userId = await this.currentUserId();
    if (!userId) return fail('unauthorized', 'Sign in to place an order.');
    if (input.items.length === 0) return fail('validation', 'Your cart is empty.');

    const store = load();
    const now = new Date().toISOString();
    const orderId = uuid();

    const items: OrderItemRow[] = input.items.map((line) => ({
      id: uuid(),
      order_id: orderId,
      product_id: line.productId,
      product_name: line.name,
      product_slug: line.slug,
      face_value_cents: toCents(line.faceValue),
      unit_price_cents: toCents(line.unitPrice),
      quantity: line.quantity,
      total_cents: toCents(line.unitPrice) * line.quantity,
      created_at: now,
    }));

    const subtotalCents = input.items.reduce(
      (sum, line) => sum + toCents(line.faceValue) * line.quantity,
      0,
    );
    const totalCents = items.reduce((sum, item) => sum + item.total_cents, 0);

    const row: OrderRow = {
      id: orderId,
      user_id: userId,
      reference: orderReference(),
      subtotal_cents: subtotalCents,
      discount_cents: Math.max(0, subtotalCents - totalCents),
      total_cents: totalCents,
      currency: 'USD',
      order_status: 'pending',
      payment_status: 'pending',
      contact_email: input.contactEmail,
      note: input.note ?? null,
      created_at: now,
      updated_at: now,
    };

    store.orders.unshift(row);
    store.items.push(...items);
    save(store);

    return ok(this.compose(store, row));
  }

  async listOrders(): Promise<Result<Order[]>> {
    await delay(NETWORK_SIMULATION_MS);
    const userId = await this.currentUserId();
    if (!userId) return fail('unauthorized', 'Sign in to view your orders.');

    const store = load();
    const rows = store.orders
      .filter((row) => row.user_id === userId)
      .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

    return ok(rows.map((row) => this.compose(store, row)));
  }

  async getOrder(idOrReference: string): Promise<Result<Order>> {
    await delay(NETWORK_SIMULATION_MS);
    const userId = await this.currentUserId();
    if (!userId) return fail('unauthorized', 'Sign in to view this order.');

    const store = load();
    const row = store.orders.find(
      (item) => item.id === idOrReference || item.reference === idOrReference,
    );

    // Same response for "missing" and "not yours" — no existence leak.
    if (!row || row.user_id !== userId) {
      return fail('not_found', 'We couldn’t find that order on your account.');
    }

    return ok(this.compose(store, row));
  }

  async cancelOrder(orderId: string): Promise<Result<Order>> {
    await delay(NETWORK_SIMULATION_MS + 160);
    const userId = await this.currentUserId();
    if (!userId) return fail('unauthorized', 'Sign in to manage this order.');

    const store = load();
    const row = store.orders.find((item) => item.id === orderId && item.user_id === userId);
    if (!row) return fail('not_found', 'We couldn’t find that order on your account.');

    if (row.payment_status === 'paid') {
      return fail(
        'conflict',
        'This order has already been paid. Open a support ticket and we’ll take it from there.',
      );
    }

    row.order_status = 'cancelled';
    row.payment_status = 'cancelled';
    row.updated_at = new Date().toISOString();
    save(store);
    return ok(this.compose(store, row));
  }

  async applyStatus(
    orderId: string,
    next: { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus },
  ): Promise<Result<Order>> {
    const userId = await this.currentUserId();
    if (!userId) return fail('unauthorized', 'Sign in to view this order.');

    const store = load();
    const row = store.orders.find((item) => item.id === orderId && item.user_id === userId);
    if (!row) return fail('not_found', 'We couldn’t find that order on your account.');

    if (next.orderStatus) row.order_status = next.orderStatus;
    if (next.paymentStatus) row.payment_status = next.paymentStatus;
    row.updated_at = new Date().toISOString();
    save(store);
    return ok(this.compose(store, row));
  }
}
