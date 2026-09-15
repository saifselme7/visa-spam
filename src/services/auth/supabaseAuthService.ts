/**
 * Supabase Auth adapter (stub).
 *
 * Wiring notes for the next phase:
 *  - signIn      -> supabase.auth.signInWithPassword({ email, password })
 *  - signUp      -> supabase.auth.signUp({ email, password, options: { data: { display_name } } })
 *  - signOut     -> supabase.auth.signOut()
 *  - reset       -> supabase.auth.resetPasswordForEmail(email, { redirectTo })
 *  - profile     -> update public.profiles where id = auth.uid() (RLS enforced)
 *  - listener    -> supabase.auth.onAuthStateChange(...)
 *
 * The Gmail-only registration rule MUST also exist server-side: either a
 * `before user created` auth hook, or a trigger on auth.users that raises when
 * the domain is not allow-listed. The client-side check in `emailPolicy.ts` is
 * a convenience, not the enforcement point.
 */
import type { AuthSession, UserProfile } from '@/types/domain';
import { fail, type Result } from '@/types/result';
import type { AuthListener, AuthService, Credentials, ProfileUpdate, RegistrationInput } from './types';

const NOT_IMPLEMENTED = 'Accounts are not available yet — the identity provider is not connected.';

export class SupabaseAuthService implements AuthService {
  async getSession(): Promise<Result<AuthSession | null>> {
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async signIn(_credentials: Credentials): Promise<Result<AuthSession>> {
    void _credentials;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async signUp(
    _input: RegistrationInput,
  ): Promise<Result<{ requiresVerification: boolean; email: string }>> {
    void _input;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async signOut(): Promise<Result<null>> {
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async requestPasswordReset(_email: string): Promise<Result<{ email: string }>> {
    void _email;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async resendVerification(_email: string): Promise<Result<{ email: string }>> {
    void _email;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async confirmVerification(_email: string): Promise<Result<AuthSession>> {
    void _email;
    // With Supabase the confirmation happens through the emailed link, not here.
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async updateProfile(_update: ProfileUpdate): Promise<Result<UserProfile>> {
    void _update;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  async changePassword(_current: string, _next: string): Promise<Result<null>> {
    void _current;
    void _next;
    return fail('not_configured', NOT_IMPLEMENTED);
  }

  onAuthStateChange(_listener: AuthListener): () => void {
    void _listener;
    return () => undefined;
  }
}
