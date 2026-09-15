import { ALLOWED_EMAIL_DOMAINS } from '@/config/site';
import { isEmail } from '@/utils/validation';

/**
 * Registration is restricted to Gmail addresses.
 *
 * IMPORTANT: this module is the *first* line of defence only. Client-side
 * checks are a UX affordance and can be bypassed with a console call. The same
 * rule must be enforced server-side once Supabase is connected — see
 * `docs/supabase-rls.md` for the matching `handle_new_user` trigger that raises
 * on a non-allowed domain, plus the Auth hook configuration.
 */

export interface EmailPolicyResult {
  valid: boolean;
  /** User-facing message; empty when valid. */
  message: string;
  normalized: string;
}

export const ALLOWED_DOMAINS: readonly string[] = ALLOWED_EMAIL_DOMAINS;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function emailDomain(email: string): string {
  const at = email.lastIndexOf('@');
  return at === -1 ? '' : email.slice(at + 1).toLowerCase();
}

export function isAllowedRegistrationEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return isEmail(normalized) && ALLOWED_DOMAINS.includes(emailDomain(normalized));
}

export function checkRegistrationEmail(email: string): EmailPolicyResult {
  const normalized = normalizeEmail(email);

  if (normalized.length === 0) {
    return { valid: false, message: 'Enter your email address.', normalized };
  }

  if (!isEmail(normalized)) {
    return { valid: false, message: 'That doesn’t look like a valid email address.', normalized };
  }

  const domain = emailDomain(normalized);
  if (!ALLOWED_DOMAINS.includes(domain)) {
    return {
      valid: false,
      message: `Registration is limited to Gmail addresses. ${domain} isn’t accepted yet.`,
      normalized,
    };
  }

  return { valid: true, message: '', normalized };
}
