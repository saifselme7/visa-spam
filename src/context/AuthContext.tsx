import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authService } from '@/services/auth/authService';
import type { Credentials, ProfileUpdate, RegistrationInput } from '@/services/auth/types';
import type { AuthSession, UserProfile } from '@/types/domain';
import type { Result, ServiceError } from '@/types/result';

export interface AuthContextValue {
  session: AuthSession | null;
  user: UserProfile | null;
  status: 'loading' | 'authenticated' | 'anonymous';
  isAuthenticated: boolean;
  signIn: (credentials: Credentials) => Promise<Result<AuthSession>>;
  signUp: (
    input: RegistrationInput,
  ) => Promise<Result<{ requiresVerification: boolean; email: string }>>;
  signOut: () => Promise<void>;
  confirmVerification: (email: string) => Promise<Result<AuthSession>>;
  requestPasswordReset: (email: string) => Promise<Result<{ email: string }>>;
  updateProfile: (update: ProfileUpdate) => Promise<Result<UserProfile>>;
  changePassword: (current: string, next: string) => Promise<Result<null>>;
  error: ServiceError | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const service = useMemo(() => authService(), []);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthContextValue['status']>('loading');
  const [error, setError] = useState<ServiceError | null>(null);

  useEffect(() => {
    let active = true;

    void service.getSession().then((result) => {
      if (!active) return;
      if (result.ok) {
        setSession(result.data);
        setStatus(result.data ? 'authenticated' : 'anonymous');
      } else {
        // A missing backend must not trap the app in a loading state.
        setStatus('anonymous');
        setError(result.error);
      }
    });

    const unsubscribe = service.onAuthStateChange((next) => {
      setSession(next);
      setStatus(next ? 'authenticated' : 'anonymous');
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [service]);

  const signIn = useCallback(
    async (credentials: Credentials) => {
      setError(null);
      const result = await service.signIn(credentials);
      if (result.ok) {
        setSession(result.data);
        setStatus('authenticated');
      } else {
        setError(result.error);
      }
      return result;
    },
    [service],
  );

  const signUp = useCallback(
    async (input: RegistrationInput) => {
      setError(null);
      const result = await service.signUp(input);
      if (!result.ok) setError(result.error);
      return result;
    },
    [service],
  );

  const signOut = useCallback(async () => {
    await service.signOut();
    setSession(null);
    setStatus('anonymous');
  }, [service]);

  const confirmVerification = useCallback(
    async (email: string) => {
      const result = await service.confirmVerification(email);
      if (result.ok) {
        setSession(result.data);
        setStatus('authenticated');
      }
      return result;
    },
    [service],
  );

  const requestPasswordReset = useCallback(
    (email: string) => service.requestPasswordReset(email),
    [service],
  );

  const updateProfile = useCallback(
    async (update: ProfileUpdate) => {
      const result = await service.updateProfile(update);
      if (result.ok) {
        setSession((current) => (current ? { ...current, user: result.data } : current));
      }
      return result;
    },
    [service],
  );

  const changePassword = useCallback(
    (current: string, next: string) => service.changePassword(current, next),
    [service],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      status,
      isAuthenticated: status === 'authenticated',
      signIn,
      signUp,
      signOut,
      confirmVerification,
      requestPasswordReset,
      updateProfile,
      changePassword,
      error,
    }),
    [
      session,
      status,
      signIn,
      signUp,
      signOut,
      confirmVerification,
      requestPasswordReset,
      updateProfile,
      changePassword,
      error,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
