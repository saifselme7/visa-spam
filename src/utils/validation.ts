/** Shared, framework-free validators used by forms and services alike. */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Too short' | 'Weak' | 'Fair' | 'Strong' | 'Excellent';
  issues: string[];
}

export function evaluatePassword(password: string): PasswordStrength {
  const issues: string[] = [];
  if (password.length < 8) issues.push('Use at least 8 characters.');
  if (!/[a-z]/.test(password)) issues.push('Add a lowercase letter.');
  if (!/[A-Z]/.test(password)) issues.push('Add an uppercase letter.');
  if (!/\d/.test(password)) issues.push('Add a number.');

  if (password.length < 8) return { score: 0, label: 'Too short', issues };

  const passed = 4 - issues.length + (password.length >= 12 ? 1 : 0);
  const score = Math.max(1, Math.min(4, passed)) as 1 | 2 | 3 | 4;
  const labels = { 1: 'Weak', 2: 'Fair', 3: 'Strong', 4: 'Excellent' } as const;
  return { score, label: labels[score], issues };
}

export function requiredText(value: string, field: string): string | null {
  return value.trim().length === 0 ? `${field} is required.` : null;
}

export function maxLength(value: string, limit: number, field: string): string | null {
  return value.length > limit ? `${field} must be ${limit} characters or fewer.` : null;
}
