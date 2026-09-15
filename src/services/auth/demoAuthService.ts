import { STORAGE_KEYS } from '@/config/site';
import { DEMO_CREDENTIALS, demoProfileRow } from '@/data/demoAccount';
import { NETWORK_SIMULATION_MS, delay } from '@/services/latency';
import { mapProfile } from '@/services/mappers';
import type { ProfileRow } from '@/types/database';
import type { AuthSession, UserProfile } from '@/types/domain';
import { fail, ok, type Result } from '@/types/result';
import { uuid } from '@/utils/id';
import { readJson, removeKey, writeJson } from '@/utils/storage';
import { evaluatePassword } from '@/utils/validation';
import { checkRegistrationEmail, normalizeEmail } from './emailPolicy';
import type { AuthListener, AuthService, Credentials, ProfileUpdate, RegistrationInput } from './types';

/**
 * DEMO-ONLY authentication.
 *
 * This implementation exists so the interface can be exercised without a
 * Supabase project. It stores "accounts" in localStorage with no hashing and
 * no real session token, which is acceptable precisely because it guards
 * nothing but local mock data. It is selected only when VITE_DEMO_MODE=true,
 * and `assertDemoModeSafety()` shouts if that happens in a production build.
 */

interface DemoAccount {
  profile: ProfileRow;
  /** Plaintext by design — demo fixture, never a real credential. */
  password: string;
  verified: boolean;
}

interface StoredSession {
  userId: string;
  expiresAt: string;
}

const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function seedAccounts(): DemoAccount[] {
  return [{ profile: demoProfileRow, password: DEMO_CREDENTIALS.password, verified: true }];
}

function loadAccounts(): DemoAccount[] {
  const stored = readJson<DemoAccount[] | null>(STORAGE_KEYS.accounts, null);
  if (!stored || stored.length === 0) {
    const seeded = seedAccounts();
    writeJson(STORAGE_KEYS.accounts, seeded);
    return seeded;
  }
  // Always keep the fixture account available even if storage was tampered with.
  if (!stored.some((account) => account.profile.email === DEMO_CREDENTIALS.email)) {
    stored.push(seedAccounts()[0]);
    writeJson(STORAGE_KEYS.accounts, stored);
  }
  return stored;
}

function saveAccounts(accounts: DemoAccount[]): void {
  writeJson(STORAGE_KEYS.accounts, accounts);
}

function toSession(profile: ProfileRow): AuthSession {
  return {
    user: mapProfile(profile),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    source: 'demo',
  };
}

export class DemoAuthService implements AuthService {
  private listeners = new Set<AuthListener>();

  private emit(session: AuthSession | null): void {
    this.listeners.forEach((listener) => {
      listener(session);
    });
  }

  private currentAccount(): DemoAccount | null {
    const stored = readJson<StoredSession | null>(STORAGE_KEYS.session, null);
    if (!stored) return null;
    if (new Date(stored.expiresAt).getTime() < Date.now()) {
      removeKey(STORAGE_KEYS.session);
      return null;
    }
    return loadAccounts().find((account) => account.profile.id === stored.userId) ?? null;
  }

  private persistSession(profile: ProfileRow): AuthSession {
    const session = toSession(profile);
    writeJson(STORAGE_KEYS.session, { userId: profile.id, expiresAt: session.expiresAt });
    return session;
  }

  async getSession(): Promise<Result<AuthSession | null>> {
    await delay(60);
    const account = this.currentAccount();
    return ok(account ? toSession(account.profile) : null);
  }

  async signIn({ email, password }: Credentials): Promise<Result<AuthSession>> {
    await delay(NETWORK_SIMULATION_MS + 220);
    const normalized = normalizeEmail(email);
    const account = loadAccounts().find((item) => item.profile.email === normalized);

    // Same message for unknown account and wrong password — no account enumeration.
    if (!account || account.password !== password) {
      return fail('unauthorized', 'Email or password is incorrect.');
    }

    if (!account.verified) {
      return fail('unauthorized', 'Confirm your email address before signing in.');
    }

    const session = this.persistSession(account.profile);
    this.emit(session);
    return ok(session);
  }

  async signUp(input: RegistrationInput) {
    await delay(NETWORK_SIMULATION_MS + 260);

    const policy = checkRegistrationEmail(input.email);
    if (!policy.valid) {
      return fail<{ requiresVerification: boolean; email: string }>('validation', policy.message, {
        email: policy.message,
      });
    }

    const strength = evaluatePassword(input.password);
    if (strength.score === 0 || strength.issues.length > 1) {
      return fail<{ requiresVerification: boolean; email: string }>(
        'validation',
        'Choose a stronger password.',
        { password: strength.issues[0] ?? 'Choose a stronger password.' },
      );
    }

    const accounts = loadAccounts();
    if (accounts.some((account) => account.profile.email === policy.normalized)) {
      return fail<{ requiresVerification: boolean; email: string }>(
        'conflict',
        'An account already exists for that address.',
        { email: 'An account already exists for that address.' },
      );
    }

    const now = new Date().toISOString();
    const profile: ProfileRow = {
      id: uuid(),
      email: policy.normalized,
      display_name: input.displayName.trim() || policy.normalized.split('@')[0],
      avatar_url: null,
      role: 'customer',
      preferences: {
        currency: 'USD',
        preferred_asset: 'USDT',
        order_email_updates: true,
        reduced_motion: null,
      },
      marketing_opt_in: Boolean(input.marketingOptIn),
      created_at: now,
      updated_at: now,
    };

    accounts.push({ profile, password: input.password, verified: false });
    saveAccounts(accounts);

    return ok({ requiresVerification: true, email: policy.normalized });
  }

  async signOut(): Promise<Result<null>> {
    await delay(80);
    removeKey(STORAGE_KEYS.session);
    this.emit(null);
    return ok(null);
  }

  async requestPasswordReset(email: string) {
    await delay(NETWORK_SIMULATION_MS + 200);
    const normalized = normalizeEmail(email);
    // Always succeed: revealing whether an address exists would leak accounts.
    return ok({ email: normalized });
  }

  async resendVerification(email: string) {
    await delay(NETWORK_SIMULATION_MS);
    return ok({ email: normalizeEmail(email) });
  }

  async confirmVerification(email: string): Promise<Result<AuthSession>> {
    await delay(NETWORK_SIMULATION_MS + 240);
    const accounts = loadAccounts();
    const account = accounts.find((item) => item.profile.email === normalizeEmail(email));
    if (!account) {
      return fail('not_found', 'We couldn’t find a pending registration for that address.');
    }
    account.verified = true;
    saveAccounts(accounts);
    const session = this.persistSession(account.profile);
    this.emit(session);
    return ok(session);
  }

  async updateProfile(update: ProfileUpdate): Promise<Result<UserProfile>> {
    await delay(NETWORK_SIMULATION_MS + 120);
    const current = this.currentAccount();
    if (!current) return fail('unauthorized', 'Sign in to update your profile.');

    const accounts = loadAccounts();
    const account = accounts.find((item) => item.profile.id === current.profile.id);
    if (!account) return fail('unauthorized', 'Sign in to update your profile.');

    if (update.displayName !== undefined) {
      const name = update.displayName.trim();
      if (name.length < 2) {
        return fail('validation', 'Display name must be at least 2 characters.', {
          displayName: 'Display name must be at least 2 characters.',
        });
      }
      account.profile.display_name = name;
    }

    if (update.marketingOptIn !== undefined) {
      account.profile.marketing_opt_in = update.marketingOptIn;
    }

    if (update.preferences) {
      account.profile.preferences = {
        ...account.profile.preferences,
        currency: update.preferences.currency ?? account.profile.preferences.currency,
        preferred_asset:
          update.preferences.preferredAsset ?? account.profile.preferences.preferred_asset,
        order_email_updates:
          update.preferences.orderEmailUpdates ?? account.profile.preferences.order_email_updates,
      };
    }

    account.profile.updated_at = new Date().toISOString();
    saveAccounts(accounts);
    this.emit(toSession(account.profile));
    return ok(mapProfile(account.profile));
  }

  async changePassword(currentPassword: string, nextPassword: string): Promise<Result<null>> {
    await delay(NETWORK_SIMULATION_MS + 200);
    const current = this.currentAccount();
    if (!current) return fail('unauthorized', 'Sign in to change your password.');

    if (current.password !== currentPassword) {
      return fail('validation', 'Current password is incorrect.', {
        currentPassword: 'Current password is incorrect.',
      });
    }

    const strength = evaluatePassword(nextPassword);
    if (strength.score === 0 || strength.issues.length > 1) {
      return fail('validation', 'Choose a stronger password.', {
        newPassword: strength.issues[0] ?? 'Choose a stronger password.',
      });
    }

    const accounts = loadAccounts();
    const account = accounts.find((item) => item.profile.id === current.profile.id);
    if (!account) return fail('unauthorized', 'Sign in to change your password.');
    account.password = nextPassword;
    saveAccounts(accounts);
    return ok(null);
  }

  onAuthStateChange(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
