import { MockSupportService } from './mockSupportService';
import type { SupportService } from './types';

let instance: SupportService | null = null;

/**
 * Tickets are queued locally until Supabase is connected; the Supabase version
 * inserts into `support_tickets` with user_id = auth.uid() (nullable for guests).
 */
export function supportService(): SupportService {
  instance ??= new MockSupportService();
  return instance;
}

export type { SupportService };
