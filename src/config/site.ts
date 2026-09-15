import { env } from './env';
import type { PaymentMethod } from '@/types/domain';

export const site = {
  name: env.appName,
  tagline: 'Digital value, without the noise.',
  description:
    'VOIDCARD is a digital storefront for prepaid and gift cards. Pick a denomination, pay with stablecoins or crypto, receive your code.',
  url: env.appUrl,
  supportEmail: env.supportEmail,
  defaultCurrency: 'USD' as const,
} as const;

export const ROUTES = {
  home: '/',
  catalog: '/catalog',
  product: (slugOrId: string) => `/product/${slugOrId}`,
  deals: '/deals',
  search: '/search',
  cart: '/cart',
  checkout: '/checkout',
  order: (id: string) => `/order/${id}`,
  account: '/account',
  profile: '/account/profile',
  orders: '/account/orders',
  wishlist: '/account/wishlist',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  verifyEmail: '/verify-email',
  howItWorks: '/how-it-works',
  faq: '/faq',
  support: '/support',
  about: '/about',
  terms: '/terms',
  privacy: '/privacy',
} as const;

/**
 * Payment methods surfaced at checkout. `enabled` would come from
 * `site_settings.supported_assets` once Supabase is connected.
 */
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    asset: 'USDT',
    name: 'Tether',
    network: 'TRC20',
    confirmationsRequired: 12,
    estimatedSettlement: '1–3 minutes',
    enabled: true,
  },
  {
    asset: 'USDC',
    name: 'USD Coin',
    network: 'ERC20',
    confirmationsRequired: 12,
    estimatedSettlement: '2–5 minutes',
    enabled: true,
  },
  {
    asset: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin',
    confirmationsRequired: 2,
    estimatedSettlement: '20–40 minutes',
    enabled: true,
  },
  {
    asset: 'ETH',
    name: 'Ethereum',
    network: 'ERC20',
    confirmationsRequired: 12,
    estimatedSettlement: '2–5 minutes',
    enabled: true,
  },
];

/** Registration is limited to Gmail addresses (see services/auth/emailPolicy.ts). */
export const ALLOWED_EMAIL_DOMAINS = ['gmail.com'] as const;

export const STORAGE_KEYS = {
  cart: 'voidcard.cart.v1',
  wishlist: 'voidcard.wishlist.v1',
  session: 'voidcard.demo-session.v1',
  orders: 'voidcard.demo-orders.v1',
  accounts: 'voidcard.demo-accounts.v1',
  recentSearches: 'voidcard.recent-searches.v1',
} as const;
