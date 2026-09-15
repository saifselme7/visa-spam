import type { SupportTicket, SupportTicketDraft } from '@/types/domain';
import type { Result } from '@/types/result';

export interface SupportService {
  createTicket(draft: SupportTicketDraft): Promise<Result<SupportTicket>>;
  listTickets(): Promise<Result<SupportTicket[]>>;
}
