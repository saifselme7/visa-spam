/**
 * Defensive localStorage wrapper.
 * Private browsing, disabled storage and corrupted payloads must never crash
 * the app — every failure degrades to the provided fallback.
 */

function available(): boolean {
  try {
    const probe = '__voidcard_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

let supported: boolean | null = null;

export function storageAvailable(): boolean {
  supported ??= typeof window !== 'undefined' && available();
  return supported;
}

export function readJson<T>(key: string, fallback: T): T {
  if (!storageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): boolean {
  if (!storageAvailable()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  if (!storageAvailable()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* storage unavailable — nothing to clean up */
  }
}
