/**
 * Environment access point.
 *
 * Only `VITE_`-prefixed variables exist in the browser bundle, and every one of
 * them is PUBLIC by definition. Secrets (Supabase service-role key, payment
 * provider API keys, wallet keys) must never appear here — they belong to a
 * server, an Edge Function, or the provider dashboard.
 */

const raw = import.meta.env;

const bool = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined) return fallback;
  return value.trim().toLowerCase() === 'true';
};

const str = (value: string | undefined, fallback = ''): string =>
  value === undefined || value.trim() === '' ? fallback : value.trim();

export const env = {
  appName: str(raw.VITE_APP_NAME, 'VOIDCARD'),
  appUrl: str(raw.VITE_APP_URL, 'https://voidcard.example'),
  supportEmail: str(raw.VITE_SUPPORT_EMAIL, 'support@voidcard.example'),

  /** Public Supabase project URL. Safe to ship. */
  supabaseUrl: str(raw.VITE_SUPABASE_URL),
  /** Public anon key — protected by Row Level Security, not by secrecy. */
  supabaseAnonKey: str(raw.VITE_SUPABASE_ANON_KEY),

  /**
   * Demo mode runs the app on in-memory/localStorage mocks with a fake account.
   * It must never be enabled for a real deployment; see `assertDemoModeSafety`.
   */
  demoMode: bool(raw.VITE_DEMO_MODE, true),

  isProd: raw.PROD === true,
  isDev: raw.DEV === true,
} as const;

export const isSupabaseConfigured = (): boolean =>
  env.supabaseUrl.length > 0 && env.supabaseAnonKey.length > 0;

/**
 * Which backend the services resolve to.
 * - `demo`     : mock data, simulated auth/payments, clearly labelled in the UI
 * - `supabase` : real project (requires URL + anon key)
 * - `unconfigured` : neither — the UI shows a configuration error state
 */
export type BackendMode = 'demo' | 'supabase' | 'unconfigured';

export function resolveBackendMode(): BackendMode {
  if (env.demoMode) return 'demo';
  if (isSupabaseConfigured()) return 'supabase';
  return 'unconfigured';
}

export const backendMode: BackendMode = resolveBackendMode();
export const isDemoBackend = backendMode === 'demo';

/**
 * Loud guard rail: demo authentication in a production build is a security
 * bug, not a convenience. We surface it instead of letting it pass silently.
 */
export function assertDemoModeSafety(): void {
  if (env.demoMode && env.isProd) {
    // eslint-disable-next-line no-console
    console.error(
      '[VOIDCARD] VITE_DEMO_MODE=true in a production build. ' +
        'Demo auth and simulated payments are active. Set VITE_DEMO_MODE=false and ' +
        'configure VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY before going live.',
    );
  }
  if (backendMode === 'unconfigured') {
    // eslint-disable-next-line no-console
    console.error(
      '[VOIDCARD] No backend configured. Set VITE_DEMO_MODE=true for local work, ' +
        'or provide Supabase credentials.',
    );
  }
}
