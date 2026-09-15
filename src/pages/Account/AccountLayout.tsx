import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { AccountNav } from '@/components/account/AccountNav';
import { formatDate } from '@/utils/format';

/** Shell for every /account/* route: identity block, nav, outlet. */
export default function AccountLayout() {
  const { user, signOut } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const onSignOut = async () => {
    await signOut();
    notify({ title: 'Signed out' });
    navigate(ROUTES.home);
  };

  return (
    <Page atmosphere="account">
      <Container className="pt-12 pb-8 sm:pt-16">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              className="inline-flex size-12 items-center justify-center rounded-[12px] border border-white/8 bg-void-850 font-mono text-[15px] text-accent-500"
            >
              {(user?.displayName ?? 'U').slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h1 className="text-[22px] leading-tight">{user?.displayName}</h1>
              <p className="mt-1 text-[13px] text-void-400">
                {user?.email}
                {user?.createdAt && ` · member since ${formatDate(user.createdAt)}`}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            iconLeft={<LogOut />}
            onClick={() => {
              void onSignOut();
            }}
          >
            Sign out
          </Button>
        </div>
      </Container>

      <Container>
        <div className="grid gap-8 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
          <AccountNav />
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </Container>
    </Page>
  );
}
