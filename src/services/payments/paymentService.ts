import { backendMode } from '@/config/env';
import { MockPaymentService } from './mockPaymentService';
import { SupabasePaymentService } from './supabasePaymentService';
import type { PaymentService } from './types';

let instance: PaymentService | null = null;

export function paymentService(): PaymentService {
  instance ??= backendMode === 'supabase' ? new SupabasePaymentService() : new MockPaymentService();
  return instance;
}
