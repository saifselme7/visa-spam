import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ToastViewport } from '@/components/ui/ToastViewport';
import { router } from '@/routes/router';

/**
 * Composition root: providers, global error boundary, router, toast viewport.
 * All page content lives in src/pages — nothing is implemented here.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RouterProvider router={router} />
              <ToastViewport />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
