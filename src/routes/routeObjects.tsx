import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { ROUTES } from '@/config/site';
import { RootLayout } from '@/components/layout/RootLayout';
import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';

/**
 * Route table.
 *
 * Every page is code-split: the initial bundle only carries the shell plus the
 * home page chunk. Account pages sit behind <ProtectedRoute>; auth pages sit
 * behind <GuestRoute> so signed-in users are not shown a login form.
 */

const HomePage = lazy(() => import('@/pages/Home/HomePage'));
const CatalogPage = lazy(() => import('@/pages/Catalog/CatalogPage'));
const ProductPage = lazy(() => import('@/pages/Product/ProductPage'));
const DealsPage = lazy(() => import('@/pages/Deals/DealsPage'));
const SearchPage = lazy(() => import('@/pages/Search/SearchPage'));
const CartPage = lazy(() => import('@/pages/Cart/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/Checkout/CheckoutPage'));
const OrderDetailPage = lazy(() => import('@/pages/Confirmation/OrderDetailPage'));

const AccountLayout = lazy(() => import('@/pages/Account/AccountLayout'));
const AccountOverviewPage = lazy(() => import('@/pages/Account/AccountOverviewPage'));
const ProfilePage = lazy(() => import('@/pages/Account/ProfilePage'));
const OrdersPage = lazy(() => import('@/pages/Orders/OrdersPage'));
const WishlistPage = lazy(() => import('@/pages/Wishlist/WishlistPage'));

const LoginPage = lazy(() => import('@/pages/Account/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/Account/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/Account/ForgotPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/Account/VerifyEmailPage'));

const HowItWorksPage = lazy(() => import('@/pages/HowItWorks/HowItWorksPage'));
const FaqPage = lazy(() => import('@/pages/FAQ/FaqPage'));
const SupportPage = lazy(() => import('@/pages/Support/SupportPage'));
const AboutPage = lazy(() => import('@/pages/About/AboutPage'));
const TermsPage = lazy(() => import('@/pages/Legal/TermsPage'));
const PrivacyPage = lazy(() => import('@/pages/Legal/PrivacyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));

export const routeObjects: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'product/:id', element: <ProductPage /> },
      { path: 'deals', element: <DealsPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: 'order/:id', element: <OrderDetailPage /> },
          {
            path: 'account',
            element: <AccountLayout />,
            children: [
              { index: true, element: <AccountOverviewPage /> },
              { path: 'profile', element: <ProfilePage /> },
              { path: 'orders', element: <OrdersPage /> },
              { path: 'wishlist', element: <WishlistPage /> },
            ],
          },
        ],
      },

      {
        element: <GuestRoute />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
          { path: 'verify-email', element: <VerifyEmailPage /> },
        ],
      },

      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'privacy', element: <PrivacyPage /> },

      // Explicit /404 plus a catch-all, so both direct links and typos work.
      { path: '404', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  // Safety net for any stray absolute redirect.
  { path: '/home', element: <Navigate to={ROUTES.home} replace /> },
];
