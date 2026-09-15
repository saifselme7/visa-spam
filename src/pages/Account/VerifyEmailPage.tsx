import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { isDemoBackend } from '@/config/env';
import { ROUTES } from '@/config/site';
import { useAuth } from '@/hooks/useAuth';
import { useSeo } from '@/hooks/useSeo';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/forms/FormError';
import { AuthLayout } from './AuthLayout';

export default function VerifyEmailPage() {
  useSeo({
    title: 'Verify your email',
    description: 'Confirm your email address to finish creating your VOIDCARD account.',
    path: ROUTES.verifyEmail,
    noIndex: true,
  });

  const [params] = useSearchParams();
  const email = params.get('email') ?? '';
  const navigate = useNavigate();
  const { confirmVerification } = useAuth();
  const { notify } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const onConfirm = async () => {
    setWorking(true);
    const result = await confirmVerification(email);
    setWorking(false);
    if (result.ok) {
      notify({ title: 'Email confirmed', description: email, tone: 'success' });
      navigate(ROUTES.account, { replace: true });
    } else {
      setError(result.error.message);
    }
  };

  return (
    <AuthLayout
      title="Confirm your email"
      subtitle={
        email
          ? `We sent a confirmation link to ${email}. Open it to activate your account.`
          : 'Open the confirmation link we emailed you to activate your account.'
      }
      footer={
        <>
          Wrong address?{' '}
          <Link to={ROUTES.register} className="text-accent-500 hover:underline">
            Start again
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <FormError message={error} />

        <div className="flex items-start gap-3 rounded-[12px] border border-white/8 bg-void-850/60 p-4">
          <MailCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-500" />
          <p className="text-[13px] leading-relaxed text-void-300">
            Links expire after a short window. If it has already expired, request a new one from the
            sign-in screen.
          </p>
        </div>

        {isDemoBackend && (
          <div className="rounded-[12px] border border-signal-amber/25 bg-signal-amber/[0.06] p-4">
            <p className="text-[12.5px] leading-relaxed text-signal-amber">
              <strong className="font-medium">Demo mode.</strong> No email is actually sent. Use the
              button below to simulate clicking the confirmation link.
            </p>
            <Button
              className="mt-3.5"
              size="sm"
              loading={working}
              disabled={!email}
              onClick={() => {
                void onConfirm();
              }}
            >
              Simulate confirmation
            </Button>
          </div>
        )}

        <Link
          to={ROUTES.login}
          className="block text-center text-[13px] text-void-300 hover:text-void-50"
        >
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
