import { PAYMENT_METHODS } from '@/config/site';
import { NETWORK_SIMULATION_MS, delay } from '@/services/latency';
import { orderService } from '@/services/orders/orderService';
import type { PaymentIntent, PaymentStatus, PaymentTransaction } from '@/types/domain';
import { fail, ok, type Result } from '@/types/result';
import { uuid } from '@/utils/id';
import type { CreateIntentInput, PaymentService, PaymentSnapshot } from './types';

/**
 * DEMO payment simulator.
 *
 * This stands in for a real payment provider so the checkout states can be
 * designed and tested. Every rule of the production design is preserved:
 *
 *  - The status is produced by this "provider" module on a clock, NOT by the
 *    user clicking a button. `reportPaymentSent` only marks the intent as
 *    awaiting detection; it cannot make a payment succeed.
 *  - No deposit address is generated. A real address is issued by the provider
 *    server-side; here the field stays null and the UI renders a DEMO notice.
 *  - Nothing here should ever be read as evidence that money moved.
 */

const QUOTE_WINDOW_SECONDS = 15 * 60;

/** Purely illustrative reference rates for the demo quote — not market data. */
const DEMO_REFERENCE_RATE: Record<string, number> = {
  USDT: 1,
  USDC: 1,
  BTC: 64000,
  ETH: 3100,
};

const DECIMALS: Record<string, number> = { USDT: 2, USDC: 2, BTC: 8, ETH: 6 };

interface DemoPaymentRecord {
  intent: PaymentIntent;
  transactions: PaymentTransaction[];
  /** Epoch ms when the simulated provider first "sees" funds. Null until reported. */
  detectAt: number | null;
  confirmAt: number | null;
}

const store = new Map<string, DemoPaymentRecord>();

function quote(amount: number, asset: string): string {
  const rate = DEMO_REFERENCE_RATE[asset] ?? 1;
  return (amount / rate).toFixed(DECIMALS[asset] ?? 2);
}

function secondsRemaining(intent: PaymentIntent): number | null {
  if (!intent.expiresAt) return null;
  return Math.max(0, Math.round((Date.parse(intent.expiresAt) - Date.now()) / 1000));
}

function transaction(
  paymentId: string,
  status: PaymentStatus,
  confirmations: number,
  required: number,
): PaymentTransaction {
  return {
    id: uuid(),
    paymentId,
    status,
    reference: null,
    confirmations,
    requiredConfirmations: required,
    source: 'demo_simulation',
    createdAt: new Date().toISOString(),
  };
}

function snapshot(record: DemoPaymentRecord): PaymentSnapshot {
  return {
    intent: record.intent,
    transactions: record.transactions,
    secondsRemaining: secondsRemaining(record.intent),
  };
}

export class MockPaymentService implements PaymentService {
  async listMethods() {
    await delay(60);
    return ok(PAYMENT_METHODS.filter((method) => method.enabled));
  }

  async createIntent({ orderId, method }: CreateIntentInput): Promise<Result<PaymentSnapshot>> {
    await delay(NETWORK_SIMULATION_MS + 320);

    const orderResult = await orderService().getOrder(orderId);
    if (!orderResult.ok) return orderResult;
    const order = orderResult.data;

    if (order.orderStatus === 'cancelled') {
      return fail('conflict', 'This order was cancelled. Start a new order to pay.');
    }
    if (order.paymentStatus === 'paid') {
      return fail('conflict', 'This order has already been paid.');
    }

    const config = PAYMENT_METHODS.find((item) => item.asset === method);
    if (!config || !config.enabled) {
      return fail('validation', 'That payment method isn’t available right now.');
    }

    const now = Date.now();
    const intent: PaymentIntent = {
      id: uuid(),
      orderId: order.id,
      orderReference: order.reference,
      method,
      network: config.network,
      status: 'pending',
      amount: order.total,
      currency: order.currency,
      cryptoAmount: quote(order.total, method),
      // A real address is issued server-side by the provider. Never in the browser.
      depositAddress: null,
      provider: 'demo-simulator',
      expiresAt: new Date(now + QUOTE_WINDOW_SECONDS * 1000).toISOString(),
      createdAt: new Date(now).toISOString(),
    };

    const record: DemoPaymentRecord = {
      intent,
      transactions: [],
      detectAt: null,
      confirmAt: null,
    };
    store.set(intent.id, record);

    await orderService().applyStatus(order.id, { paymentStatus: 'pending', orderStatus: 'pending' });
    return ok(snapshot(record));
  }

  async getPayment(paymentId: string): Promise<Result<PaymentSnapshot>> {
    const record = store.get(paymentId);
    if (!record) return fail('not_found', 'That payment session is no longer available.');
    return ok(snapshot(record));
  }

  /**
   * Advances the simulated provider clock, then reports whatever the provider
   * currently believes. The UI treats this as read-only truth.
   */
  async pollPayment(paymentId: string): Promise<Result<PaymentSnapshot>> {
    const record = store.get(paymentId);
    if (!record) return fail('not_found', 'That payment session is no longer available.');

    const now = Date.now();
    const required =
      PAYMENT_METHODS.find((item) => item.asset === record.intent.method)?.confirmationsRequired ??
      6;

    const expired =
      record.intent.expiresAt !== null && Date.parse(record.intent.expiresAt) <= now;

    if (
      expired &&
      record.intent.status !== 'paid' &&
      record.intent.status !== 'processing' &&
      record.intent.status !== 'expired'
    ) {
      record.intent = { ...record.intent, status: 'expired' };
      record.transactions = [...record.transactions, transaction(paymentId, 'expired', 0, required)];
      await orderService().applyStatus(record.intent.orderId, {
        paymentStatus: 'expired',
        orderStatus: 'cancelled',
      });
      return ok(snapshot(record));
    }

    if (record.detectAt !== null && now >= record.detectAt && record.intent.status === 'pending') {
      record.intent = { ...record.intent, status: 'processing' };
      record.transactions = [
        ...record.transactions,
        transaction(paymentId, 'processing', 1, required),
      ];
      await orderService().applyStatus(record.intent.orderId, {
        paymentStatus: 'processing',
        orderStatus: 'payment_processing',
      });
    }

    if (record.confirmAt !== null && now >= record.confirmAt && record.intent.status === 'processing') {
      record.intent = { ...record.intent, status: 'paid' };
      record.transactions = [
        ...record.transactions,
        transaction(paymentId, 'paid', required, required),
      ];
      await orderService().applyStatus(record.intent.orderId, {
        paymentStatus: 'paid',
        orderStatus: 'preparing',
      });
    }

    return ok(snapshot(record));
  }

  /**
   * Advisory hint from the customer. In production this only asks the provider
   * to look sooner; it never changes the payment status. Here it schedules the
   * simulated detection so the states can be reviewed.
   */
  async reportPaymentSent(paymentId: string): Promise<Result<PaymentSnapshot>> {
    await delay(NETWORK_SIMULATION_MS);
    const record = store.get(paymentId);
    if (!record) return fail('not_found', 'That payment session is no longer available.');
    if (record.intent.status === 'expired' || record.intent.status === 'cancelled') {
      return fail('conflict', 'This payment window has closed. Create a new payment to continue.');
    }

    record.detectAt ??= Date.now() + 4000;
    record.confirmAt ??= Date.now() + 11000;
    return ok(snapshot(record));
  }

  async cancelPayment(paymentId: string): Promise<Result<PaymentSnapshot>> {
    await delay(NETWORK_SIMULATION_MS);
    const record = store.get(paymentId);
    if (!record) return fail('not_found', 'That payment session is no longer available.');
    if (record.intent.status === 'paid') {
      return fail('conflict', 'This payment has already been confirmed.');
    }

    record.intent = { ...record.intent, status: 'cancelled' };
    record.transactions = [...record.transactions, transaction(paymentId, 'cancelled', 0, 0)];
    await orderService().applyStatus(record.intent.orderId, {
      paymentStatus: 'cancelled',
      orderStatus: 'cancelled',
    });
    return ok(snapshot(record));
  }
}
