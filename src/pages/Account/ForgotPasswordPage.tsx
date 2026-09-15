import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useAuth } from '@/hooks/useAuth';
import { useSeo } from '@/hooks/useSeo';
import { isEmail } from '@/utils/validation';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/forms/FormError';
import { TextField } from '@/components/forms/TextField';
import { AuthLayout } from './AuthLayout';

export default function ForgotPasswordPage() {
  useSeo({
    title: 'Reset password',
    description: 'Request a password reset link for your VOIDCARD account.',
    path: ROUTES.forgotPassword,
    noIndex: true,
  });

  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError(null);
    setSubmitting(true);
    const result = await requestPasswordReset(email);
    setSubmitting(false);
    if (result.ok) setSent(true);
    else setError(result.error.message);
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We’ll send a reset link if an account exists for that address."
      footer={
        <>
          Remembered it?{' '}
          <Link to={ROUTES.login} className="text-accent-500 hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-[12px] border border-accent-500/25 bg-accent-500/[0.06] p-4">
          <CheckCircle2 aria-hidden className="size-5 text-accent-500" />
          <p className="mt-3 text-[14px] font-medium text-void-50">Check your inbox</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-void-300">
            If an account exists for {email}, a reset link is on its way. The link expires after a
            short window.
          </p>
        </div>
      ) : (
        <form onSubmit={(event) => void onSubmit(event)} noValidate className="space-y-5">
          <FormError message={error} />
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            required
            iconLeft={<Mail />}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <Button type="submit" fullWidth size="lg" loading={submitting}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
