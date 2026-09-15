import type { CartLine, Order, OrderStatus, PaymentStatus } from '@/types/domain';
import type { Result } from '@/types/result';

export interface CreateOrderInput {
  items: CartLine[];
  contactEmail: string;
  note?: string | null;
}

/**
 * Note there is no `userId` field: the owner is derived from the authenticated
 * session server-side. A client must never be able to claim another user's id.
 */
export interface OrderService {
  createOrder(input: CreateOrderInput): Promise<Result<Order>>;
  listOrders(): Promise<Result<Order[]>>;
  getOrder(idOrReference: string): Promise<Result<Order>>;
  cancelOrder(orderId: string): Promise<Result<Order>>;
  /**
   * Applies a status transition that, in production, originates from the
   * backend (payment webhook or Edge Function) rather than from the browser.
   */
  applyStatus(
    orderId: string,
    next: { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus },
  ): Promise<Result<Order>>;
}
