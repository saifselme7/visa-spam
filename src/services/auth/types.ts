import type { AuthSession, UserProfile } from '@/types/domain';
import type { Result } from '@/types/result';

export interface Credentials {
  email: string;
  password: string;
}

export interface RegistrationInput extends Credentials {
  displayName: string;
  marketingOptIn?: boolean;
}

export interface ProfileUpdate {
  displayName?: string;
  marketingOptIn?: boolean;
  preferences?: Partial<UserProfile['preferences']>;
}

export type AuthListener = (session: AuthSession | null) => void;

/** Contract shared by the demo and Supabase auth implementations. */
export interface AuthService {
  getSession(): Promise<Result<AuthSession | null>>;
  signIn(credentials: Credentials): Promise<Result<AuthSession>>;
  signUp(input: RegistrationInput): Promise<Result<{ requiresVerification: boolean; email: string }>>;
  signOut(): Promise<Result<null>>;
  requestPasswordReset(email: string): Promise<Result<{ email: string }>>;
  resendVerification(email: string): Promise<Result<{ email: string }>>;
  /** Demo-only shortcut used by /verify-email; a no-op against Supabase. */
  confirmVerification(email: string): Promise<Result<AuthSession>>;
  updateProfile(update: ProfileUpdate): Promise<Result<UserProfile>>;
  changePassword(currentPassword: string, nextPassword: string): Promise<Result<null>>;
  /** Returns an unsubscribe function. */
  onAuthStateChange(listener: AuthListener): () => void;
}
