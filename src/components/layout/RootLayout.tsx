import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import { CartDrawer } from './CartDrawer';
import { DemoModeBanner } from './DemoModeBanner';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { OfflineBanner } from './OfflineBanner';
import { ScrollToTop } from './ScrollToTop';
import { SkipLink } from './SkipLink';

/**
 * Application shell: banners, header, routed content, footer.
 * The cart drawer lives here so it can be opened from any page.
 */
export function RootLayout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <ScrollToTop />
      <OfflineBanner />
      <DemoModeBanner />

      <Navbar
        onOpenCart={() => {
          setCartOpen(true);
        }}
      />

      <main id="main" className="flex-1 focus:outline-none" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <Spinner label="Loading page" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => {
          setCartOpen(false);
        }}
      />
    </div>
  );
}
