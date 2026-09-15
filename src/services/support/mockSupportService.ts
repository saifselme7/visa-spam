import { NETWORK_SIMULATION_MS, delay } from '@/services/latency';
import { mapSupportTicket } from '@/services/mappers';
import type { SupportTicketRow } from '@/types/database';
import type { SupportTicket, SupportTicketDraft } from '@/types/domain';
import { fail, ok, type Result } from '@/types/result';
import { ticketReference, uuid } from '@/utils/id';
import { isEmail, maxLength, requiredText } from '@/utils/validation';
import type { SupportService } from './types';

/** In-memory ticket queue. Replaced by inserts into `support_tickets`. */
const rows: SupportTicketRow[] = [];

export class MockSupportService implements SupportService {
  async createTicket(draft: SupportTicketDraft): Promise<Result<SupportTicket>> {
    await delay(NETWORK_SIMULATION_MS + 280);

    const fields: Record<string, string> = {};
    if (!isEmail(draft.email)) fields.email = 'Enter a valid email address.';

    const subjectError =
      requiredText(draft.subject, 'Subject') ?? maxLength(draft.subject, 120, 'Subject');
    if (subjectError) fields.subject = subjectError;

    const messageError =
      requiredText(draft.message, 'Message') ?? maxLength(draft.message, 2000, 'Message');
    if (messageError) fields.message = messageError;
    else if (draft.message.trim().length < 20) {
      fields.message = 'Give us a little more detail — at least 20 characters.';
    }

    if (Object.keys(fields).length > 0) {
      return fail('validation', 'Check the highlighted fields and try again.', fields);
    }

    const now = new Date().toISOString();
    const row: SupportTicketRow = {
      id: uuid(),
      user_id: null,
      reference: ticketReference(),
      email: draft.email.trim().toLowerCase(),
      category: draft.category,
      priority: draft.priority ?? 'normal',
      status: 'open',
      subject: draft.subject.trim(),
      message: draft.message.trim(),
      order_reference: draft.orderReference?.trim() || null,
      created_at: now,
      updated_at: now,
    };

    rows.unshift(row);
    return ok(mapSupportTicket(row));
  }

  async listTickets(): Promise<Result<SupportTicket[]>> {
    await delay(NETWORK_SIMULATION_MS);
    return ok(rows.map(mapSupportTicket));
  }
}
