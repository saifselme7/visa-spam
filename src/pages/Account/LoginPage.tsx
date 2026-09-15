import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { isDemoBackend } from '@/config/env';
import { ROUTES } from '@/config/site';
import { DEMO_CREDENTIALS } from '@/data/demoAccount';
import { useAuth } from '@/hooks/useAuth';
import { useSeo } from '@/hooks/useSeo';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/forms/FormError';
import { PasswordField } from '@/components/forms/PasswordField';
import { TextField } from '@/components/forms/TextField';
import { AuthLayout } from './AuthLayout';

interface LocationState {
  from?: string;
}

export default function LoginPage() {
  useSeo({
    title: 'Sign in',
    description: 'Sign in to your VOIDCARD account to view orders and delivered codes.',
    path: ROUTES.login,
    noIndex: true,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const { notify } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const destination = (location.state as LocationState | null)?.from ?? ROUTES.account;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signIn({ email, password });
    setSubmitting(false);

    if (result.ok) {
      notify({ title: 'Signed in', description: result.data.user.email, tone: 'success' });
      navigate(destination, { replace: true });
    } else {
      setError(result.error.message);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your orders, codes and wishlist."
      footer={
        <>
          No account yet?{' '}
          <Link to={ROUTES.register} className="text-accent-500 hover:underline">
            Create one
          </Link>
        </>
      }
    >
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

        <div>
          <PasswordField
            label="Password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <div className="mt-2 text-right">
            <Link
              to={ROUTES.forgotPassword}
              className="text-[12.5px] text-void-300 hover:text-accent-400"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button type="submit" fullWidth size="lg" loading={submitting}>
          Sign in
        </Button>
      </form>

      {isDemoBackend && (
        <div className="mt-6 rounded-[11px] border border-white/8 bg-void-850/60 p-3.5">
          <p className="mono-label mb-2">Demo account</p>
          <p className="text-[12.5px] leading-relaxed text-void-300">
            <span className="font-mono text-void-100">{DEMO_CREDENTIALS.email}</span>
            <br />
            <span className="font-mono text-void-100">{DEMO_CREDENTIALS.password}</span>
          </p>
          <button
            type="button"
            className="mt-2.5 text-[12.5px] text-accent-500 hover:underline"
            onClick={() => {
              setEmail(DEMO_CREDENTIALS.email);
              setPassword(DEMO_CREDENTIALS.password);
            }}
          >
            Fill demo credentials
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
