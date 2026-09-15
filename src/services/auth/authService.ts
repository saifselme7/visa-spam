import { backendMode } from '@/config/env';
import { DemoAuthService } from './demoAuthService';
import { SupabaseAuthService } from './supabaseAuthService';
import type { AuthService } from './types';

let instance: AuthService | null = null;

/**
 * Resolves the active auth implementation.
 * Demo mode is opt-in through VITE_DEMO_MODE and never a silent fallback in a
 * production build (see config/env.ts -> assertDemoModeSafety).
 */
export function authService(): AuthService {
  instance ??= backendMode === 'supabase' ? new SupabaseAuthService() : new DemoAuthService();
  return instance;
}
