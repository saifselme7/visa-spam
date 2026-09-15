import { useEffect, useState, type FormEvent } from 'react';
import { ROUTES } from '@/config/site';
import { useAuth } from '@/hooks/useAuth';
import { useSeo } from '@/hooks/useSeo';
import { useToast } from '@/hooks/useToast';
import type { CryptoAsset } from '@/types/domain';
import { formatDate } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/forms/Checkbox';
import { FormError } from '@/components/forms/FormError';
import { PasswordField } from '@/components/forms/PasswordField';
import { PasswordStrengthMeter } from '@/components/forms/PasswordStrengthMeter';
import { SelectField } from '@/components/forms/SelectField';
import { TextField } from '@/components/forms/TextField';

const ASSET_OPTIONS = [
  { value: 'USDT', label: 'USDT (TRC20)' },
  { value: 'USDC', label: 'USDC (ERC20)' },
  { value: 'BTC', label: 'BTC' },
  { value: 'ETH', label: 'ETH' },
];

export default function ProfilePage() {
  useSeo({
    title: 'Profile & security',
    description: 'Manage your VOIDCARD profile, preferences and password.',
    path: ROUTES.profile,
    noIndex: true,
  });

  const { user, updateProfile, changePassword } = useAuth();
  const { notify } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [preferredAsset, setPreferredAsset] = useState<CryptoAsset>('USDT');
  const [orderEmails, setOrderEmails] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordFormError, setPasswordFormError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName);
    setPreferredAsset(user.preferences.preferredAsset);
    setOrderEmails(user.preferences.orderEmailUpdates);
    setMarketing(user.marketingOptIn);
  }, [user]);

  const onSaveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setProfileErrors({});
    setSavingProfile(true);
    const result = await updateProfile({
      displayName,
      marketingOptIn: marketing,
      preferences: { preferredAsset, orderEmailUpdates: orderEmails },
    });
    setSavingProfile(false);

    if (result.ok) notify({ title: 'Profile updated', tone: 'success' });
    else setProfileErrors(result.error.fields ?? { displayName: result.error.message });
  };

  const onChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordErrors({});
    setPasswordFormError(null);
    setSavingPassword(true);
    const result = await changePassword(currentPassword, newPassword);
    setSavingPassword(false);

    if (result.ok) {
      notify({ title: 'Password changed', tone: 'success' });
      setCurrentPassword('');
      setNewPassword('');
    } else if (result.error.fields) {
      setPasswordErrors(result.error.fields);
    } else {
      setPasswordFormError(result.error.message);
    }
  };

  return (
    <div className="max-w-xl space-y-12">
      <section aria-labelledby="profile-heading">
        <h2 id="profile-heading" className="text-lg">
          Profile
        </h2>
        <p className="mt-2 text-[13.5px] text-void-300">
          Your email is the identity on your account and can’t be changed here — contact support if
          you need to move your orders to a new address.
        </p>

        <form onSubmit={(event) => void onSaveProfile(event)} className="mt-6 space-y-5">
          <TextField
            label="Display name"
            value={displayName}
            error={profileErrors.displayName}
            onChange={(event) => {
              setDisplayName(event.target.value);
            }}
          />

          <TextField label="Email" value={user?.email ?? ''} readOnly disabled />

          <dl className="flex gap-8 rounded-[11px] border border-white/7 bg-void-900/40 p-4 text-[13px]">
            <div>
              <dt className="mono-label">Account created</dt>
              <dd className="mt-1.5 text-void-100">
                {user?.createdAt ? formatDate(user.createdAt) : '—'}
              </dd>
            </div>
            <div>
              <dt className="mono-label">Role</dt>
              <dd className="mt-1.5 text-void-100 capitalize">{user?.role}</dd>
            </div>
          </dl>

          <SelectField
            label="Preferred payment asset"
            options={ASSET_OPTIONS}
            value={preferredAsset}
            hint="Pre-selected at checkout. You can always change it per order."
            onChange={(event) => {
              setPreferredAsset(event.target.value as CryptoAsset);
            }}
          />

          <div className="space-y-3">
            <Checkbox
              label="Email me when an order status changes"
              checked={orderEmails}
              onChange={(event) => {
                setOrderEmails(event.target.checked);
              }}
            />
            <Checkbox
              label="Occasional emails about new denominations and deals"
              checked={marketing}
              onChange={(event) => {
                setMarketing(event.target.checked);
              }}
            />
          </div>

          <Button type="submit" loading={savingProfile}>
            Save changes
          </Button>
        </form>
      </section>

      <section aria-labelledby="security-heading" className="border-t border-white/7 pt-10">
        <h2 id="security-heading" className="text-lg">
          Security
        </h2>
        <p className="mt-2 text-[13.5px] text-void-300">
          Use a password you don’t reuse anywhere else. We never see it in plain text.
        </p>

        <form onSubmit={(event) => void onChangePassword(event)} className="mt-6 space-y-5">
          <FormError message={passwordFormError} />

          <PasswordField
            label="Current password"
            autoComplete="current-password"
            required
            value={currentPassword}
            error={passwordErrors.currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
            }}
          />

          <div>
            <PasswordField
              label="New password"
              autoComplete="new-password"
              required
              value={newPassword}
              error={passwordErrors.newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
              }}
            />
            <PasswordStrengthMeter password={newPassword} />
          </div>

          <Button type="submit" loading={savingPassword}>
            Change password
          </Button>
        </form>
      </section>
    </div>
  );
}
