/**
 * Supabase order adapter (stub).
 *
 * Planned implementation:
 *  - createOrder : rpc('create_order', { items }) — the function derives
 *                  auth.uid(), re-prices every line from `products` server-side
 *                  and inserts orders + order_items in one transaction. Prices
 *                  are never trusted from the browser.
 *  - listOrders  : from('orders').select('*, order_items(*)') — RLS restricts
 *                  rows to user_id = auth.uid().
 *  - cancelOrder : rpc('cancel_order', { order_id }) so the allowed status
 *                  transitions live in the database, not in the client.
 *  - applyStatus : NOT exposed to the browser in production. Status changes are
 *                  written by the payment webhook / Edge Function only.
 */
import type { Order, OrderStatus, PaymentStatus } from '@/types/domain';
import { fail, type Result } from '@/types/result';
import type { CreateOrderInput, OrderService } from './types';

const NOT_IMPLEMENTED = 'Orders are not available yet — the backend is not connected.';

export class SupabaseOrderService implements OrderService {
  async createOrder(_input: CreateOrderInput): Promise<Result<Order>> {
    void _input;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async listOrders(): Promise<Result<Order[]>> {
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async getOrder(_idOrReference: string): Promise<Result<Order>> {
    void _idOrReference;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async cancelOrder(_orderId: string): Promise<Result<Order>> {
    void _orderId;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async applyStatus(
    _orderId: string,
    _next: { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus },
  ): Promise<Result<Order>> {
    void _orderId;
    void _next;
    return fail('not_configured', 'Order status is managed by the payment backend.');
  }
}
