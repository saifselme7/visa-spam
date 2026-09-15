/**
 * Payment provider adapter (stub).
 *
 * Production shape:
 *  - createIntent : invoke('create-payment-intent', { order_id, asset }) — an
 *                   Edge Function calls the payment provider with a SERVER-side
 *                   API key, stores the row in `payments`, and returns the
 *                   provider-issued deposit address and quoted amount.
 *  - pollPayment  : select from `payments` + `payment_transactions` (read-only
 *                   for the user under RLS), or subscribe with Realtime.
 *  - Status writes happen exclusively in the provider webhook handler after
 *    on-chain verification. There is intentionally no client-side "mark paid".
 *
 * No API keys, wallet keys or seed phrases may ever appear in this file.
 */
import { fail, type Result } from '@/types/result';
import type { CreateIntentInput, PaymentService, PaymentSnapshot } from './types';
import { PAYMENT_METHODS } from '@/config/site';
import { ok } from '@/types/result';

const NOT_IMPLEMENTED = 'Payments are not available yet — the payment provider is not connected.';

export class SupabasePaymentService implements PaymentService {
  async listMethods() {
    // Would come from site_settings.supported_assets.
    return ok(PAYMENT_METHODS.filter((method) => method.enabled));
  }

  async createIntent(_input: CreateIntentInput): Promise<Result<PaymentSnapshot>> {
    void _input;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async getPayment(_paymentId: string): Promise<Result<PaymentSnapshot>> {
    void _paymentId;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async pollPayment(_paymentId: string): Promise<Result<PaymentSnapshot>> {
    void _paymentId;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async reportPaymentSent(_paymentId: string): Promise<Result<PaymentSnapshot>> {
    void _paymentId;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async cancelPayment(_paymentId: string): Promise<Result<PaymentSnapshot>> {
    void _paymentId;
    return fail('not_configured', NOT_IMPLEMENTED);
  }
}
