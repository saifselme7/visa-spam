/**
 * A tiny Result type so services never throw raw backend errors into the UI.
 * Components render `error.message`, which is always user-safe.
 */

export type ServiceErrorCode =
  | 'not_found'
  | 'unauthorized'
  | 'validation'
  | 'conflict'
  | 'rate_limited'
  | 'network'
  | 'not_configured'
  | 'unknown';

export interface ServiceError {
  code: ServiceErrorCode;
  /** Safe to show to a user. Never contains stack traces or provider internals. */
  message: string;
  /** Optional field-level messages for forms. */
  fields?: Record<string, string>;
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: ServiceError };

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });

export const fail = <T = never>(
  code: ServiceErrorCode,
  message: string,
  fields?: Record<string, string>,
): Result<T> => ({ ok: false, error: { code, message, fields } });

const SAFE_FALLBACK = 'Something went wrong on our side. Please try again in a moment.';

/** Converts an unknown thrown value into a user-safe ServiceError. */
export function toServiceError(cause: unknown, code: ServiceErrorCode = 'unknown'): ServiceError {
  if (cause instanceof Error && cause.message && cause.message.length < 180) {
    return { code, message: cause.message };
  }
  return { code, message: SAFE_FALLBACK };
}
