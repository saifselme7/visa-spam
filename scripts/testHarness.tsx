/** Test-only: mounts the real app tree against a memory router. */
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { routeObjects } from '@/routes/routeObjects';

export function renderRouteTree(url: string) {
  const router = createMemoryRouter(routeObjects, { initialEntries: [url] });
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RouterProvider router={router} />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
