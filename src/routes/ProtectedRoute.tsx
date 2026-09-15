import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/site';
import { Spinner } from '@/components/ui/Spinner';

/**
 * Gate for account-only routes.
 *
 * This is a UX guard, not a security boundary: the real protection is Row Level
 * Security on the server, which is why every service resolves ownership from
 * the session rather than from a client-supplied id.
 */
export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Checking your session" />
      </div>
    );
  }

  if (status !== 'authenticated') {
    // Preserve the destination so sign-in can send the user back.
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
