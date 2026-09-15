/**
 * Supabase client boundary.
 *
 * The `@supabase/supabase-js` package is deliberately NOT installed yet: no
 * credentials have been provided, and shipping an unused SDK would cost bundle
 * size. Everything the rest of the app needs is already abstracted behind the
 * service interfaces in `src/services/*`, so wiring Supabase up is a contained
 * change:
 *
 *   1. npm i @supabase/supabase-js
 *   2. Fill VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env
 *   3. Set VITE_DEMO_MODE=false
 *   4. Replace the body of `getSupabaseClient()` below with:
 *
 *        import { createClient } from '@supabase/supabase-js'
 *        import type { Database } from '@/types/supabase' // generated types
 *        client ??= createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
 *          auth: { persistSession: true, autoRefreshToken: true },
 *        })
 *
 *   5. Implement the Supabase variants in services/*\/supabase*.ts and return
 *      them from the corresponding `resolve*Service()` factory.
 *
 * Only the PUBLIC anon key may ever be used here. The service-role key bypasses
 * Row Level Security and must stay on the server.
 */
import { env, isSupabaseConfigured } from '@/config/env';

export interface SupabaseClientLike {
  readonly url: string;
  readonly configured: boolean;
}

let client: SupabaseClientLike | null = null;

export function getSupabaseClient(): SupabaseClientLike | null {
  if (!isSupabaseConfigured()) return null;
  client ??= { url: env.supabaseUrl, configured: true };
  return client;
}

export function requireSupabaseClient(): SupabaseClientLike {
  const instance = getSupabaseClient();
  if (!instance) {
    throw new Error(
      'Supabase is not configured. Provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    );
  }
  return instance;
}
