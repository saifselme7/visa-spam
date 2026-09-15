import { backendMode } from '@/config/env';
import { MockOrderService } from './mockOrderService';
import { SupabaseOrderService } from './supabaseOrderService';
import type { OrderService } from './types';

let instance: OrderService | null = null;

export function orderService(): OrderService {
  instance ??= backendMode === 'supabase' ? new SupabaseOrderService() : new MockOrderService();
  return instance;
}
