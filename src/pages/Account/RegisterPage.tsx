import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useAuth } from '@/hooks/useAuth';
import { useSeo } from '@/hooks/useSeo';
import { checkRegistrationEmail } from '@/services/auth/emailPolicy';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/forms/Checkbox';
import { FormError } from '@/components/forms/FormError';
import { PasswordField } from '@/components/forms/PasswordField';
import { PasswordStrengthMeter } from '@/components/forms/PasswordStrengthMeter';
import { TextField } from '@/components/forms/TextField';
import { AuthLayout } from './AuthLayout';

export default function RegisterPage() {
  useSeo({
    title: 'Create account',
    description: 'Create a VOIDCARD account to buy prepaid and gift cards.',
    path: ROUTES.register,
    noIndex: true,
  });

  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const errors: Record<string, string> = {};

    if (displayName.trim().length < 2) {
      errors.displayName = 'Enter the name you’d like us to use.';
    }

    // Frontend half of the Gmail-only rule. The server enforces it too.
    const policy = checkRegistrationEmail(email);
    if (!policy.valid) errors.email = policy.message;

    if (password !== confirm) errors.confirm = 'Passwords don’t match.';

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    const result = await signUp({
      email: policy.normalized,
      password,
      displayName,
      marketingOptIn,
    });
    setSubmitting(false);

    if (result.ok) {
      navigate(`${ROUTES.verifyEmail}?email=${encodeURIComponent(result.data.email)}`);
    } else {
      setFieldErrors(result.error.fields ?? {});
      setFormError(result.error.fields ? null : result.error.message);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Registration is currently limited to Gmail addresses while we finish email deliverability work."
      footer={
        <>
          Already have an account?{' '}
          <Link to={ROUTES.login} className="text-accent-500 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={(event) => void onSubmit(event)} noValidate className="space-y-5">
        <FormError message={formError} />

        <TextField
          label="Name"
          autoComplete="name"
          required
          iconLeft={<User />}
          value={displayName}
          error={fieldErrors.displayName}
          onChange={(event) => {
            setDisplayName(event.target.value);
          }}
        />

        <TextField
          label="Gmail address"
          type="email"
          autoComplete="email"
          required
          placeholder="you@gmail.com"
          hint="Only @gmail.com addresses are accepted right now."
          iconLeft={<Mail />}
          value={email}
          error={fieldErrors.email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />

        <div>
          <PasswordField
            label="Password"
            autoComplete="new-password"
            required
            value={password}
            error={fieldErrors.password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <PasswordField
          label="Confirm password"
          autoComplete="new-password"
          required
          value={confirm}
          error={fieldErrors.confirm}
          onChange={(event) => {
            setConfirm(event.target.value);
          }}
        />

        <Checkbox
          label="Send me occasional emails about new denominations and deals"
          checked={marketingOptIn}
          onChange={(event) => {
            setMarketingOptIn(event.target.checked);
          }}
        />

        <Button type="submit" fullWidth size="lg" loading={submitting}>
          Create account
        </Button>

        <p className="text-center text-[12px] leading-relaxed text-void-500">
          By creating an account you agree to our{' '}
          <Link to={ROUTES.terms} className="hover:text-void-300">
            Terms
          </Link>{' '}
          and{' '}
          <Link to={ROUTES.privacy} className="hover:text-void-300">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthLayout>
  );
}
