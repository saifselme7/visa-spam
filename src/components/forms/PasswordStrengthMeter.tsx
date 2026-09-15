import { useMemo } from 'react';
import { evaluatePassword } from '@/utils/validation';
import { cn } from '@/utils/cn';

const BAR_TONES = ['bg-signal-red', 'bg-signal-amber', 'bg-accent-600', 'bg-accent-500'] as const;

export function PasswordStrengthMeter({ password }: { password: string }) {
  const strength = useMemo(() => evaluatePassword(password), [password]);

  if (password.length === 0) return null;

  return (
    <div className="mt-2.5">
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={cn(
              'h-[3px] flex-1 rounded-full transition-colors duration-300',
              index < strength.score ? BAR_TONES[strength.score - 1] : 'bg-void-600',
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-[12px] text-void-400" aria-live="polite">
        {strength.label}
        {strength.issues[0] ? ` — ${strength.issues[0]}` : ''}
      </p>
    </div>
  );
}
