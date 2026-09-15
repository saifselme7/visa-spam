import type {
  CryptoAsset,
  PaymentIntent,
  PaymentMethod,
  PaymentTransaction,
} from '@/types/domain';
import type { Result } from '@/types/result';

export interface CreateIntentInput {
  orderId: string;
  method: CryptoAsset;
}

export interface PaymentSnapshot {
  intent: PaymentIntent;
  /** Ledger entries, newest last. Written by the backend in production. */
  transactions: PaymentTransaction[];
  /** Seconds left in the quote window, or null when there is no expiry. */
  secondsRemaining: number | null;
}

/**
 * Payment boundary.
 *
 * Deliberately missing: any method that lets the browser declare a payment
 * successful. Status is read from the provider (`pollPayment`), never asserted
 * by the client. `reportPaymentSent` is only a hint that speeds up provider
 * polling — it does not change the payment status by itself.
 */
export interface PaymentService {
  listMethods(): Promise<Result<PaymentMethod[]>>;
  createIntent(input: CreateIntentInput): Promise<Result<PaymentSnapshot>>;
  getPayment(paymentId: string): Promise<Result<PaymentSnapshot>>;
  /** Server-authoritative status read. Safe to call on an interval. */
  pollPayment(paymentId: string): Promise<Result<PaymentSnapshot>>;
  /** "I've sent the transfer" — advisory only. */
  reportPaymentSent(paymentId: string): Promise<Result<PaymentSnapshot>>;
  cancelPayment(paymentId: string): Promise<Result<PaymentSnapshot>>;
}
