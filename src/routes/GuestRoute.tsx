import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/site';
import { Spinner } from '@/components/ui/Spinner';

/** Keeps signed-in users away from /login and /register. */
export function GuestRoute() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Checking your session" />
      </div>
    );
  }

  if (status === 'authenticated') {
    return <Navigate to={ROUTES.account} replace />;
  }

  return <Outlet />;
}
