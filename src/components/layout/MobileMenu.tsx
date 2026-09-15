import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  Heart,
  HelpCircle,
  LifeBuoy,
  LogIn,
  Package,
  Percent,
  Store,
  User,
  X,
} from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useAuth } from '@/hooks/useAuth';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { IconButton } from '@/components/ui/IconButton';
import { SearchBar } from '@/components/navigation/SearchBar';
import { Logo } from './Logo';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const SHOP_LINKS = [
  { to: ROUTES.catalog, label: 'All cards', icon: Store, hint: 'Full catalogue' },
  { to: ROUTES.deals, label: 'Deals', icon: Percent, hint: 'Current discounts' },
];

const HELP_LINKS = [
  { to: ROUTES.howItWorks, label: 'How it works', icon: HelpCircle },
  { to: ROUTES.faq, label: 'FAQ', icon: HelpCircle },
  { to: ROUTES.support, label: 'Support', icon: LifeBuoy },
];

/**
 * Mobile navigation is a purpose-built full-height sheet: search first, large
 * touch targets, and account actions pinned to the bottom within thumb reach.
 * It is not a scaled-down copy of the desktop bar.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-100 flex flex-col bg-void-950 lg:hidden"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex h-[var(--header-h)] items-center justify-between border-b border-white/7 px-4">
            <Logo />
            <IconButton size="sm" label="Close menu" icon={<X />} onClick={onClose} />
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
            <SearchBar variant="overlay" onSubmitted={onClose} placeholder="Search cards" />

            <nav aria-label="Shop" className="mt-7">
              <p className="mono-label mb-3">Shop</p>
              <ul className="list-none space-y-2 p-0">
                {SHOP_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className="flex min-h-14 items-center gap-3.5 rounded-[12px] border border-white/7 bg-void-900/60 px-4 py-3 transition-colors active:bg-void-800"
                    >
                      <link.icon aria-hidden className="size-[18px] shrink-0 text-accent-500" />
                      <span className="flex-1">
                        <span className="block text-[15px] text-void-50">{link.label}</span>
                        <span className="block text-[12px] text-void-400">{link.hint}</span>
                      </span>
                      <ArrowUpRight aria-hidden className="size-4 text-void-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Help" className="mt-7">
              <p className="mono-label mb-3">Help</p>
              <ul className="list-none divide-y divide-white/6 rounded-[12px] border border-white/7 p-0">
                {HELP_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className="flex min-h-13 items-center gap-3.5 px-4 py-3 text-[15px] text-void-100 active:bg-void-800"
                    >
                      <link.icon aria-hidden className="size-[17px] shrink-0 text-void-400" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {isAuthenticated && (
              <nav aria-label="Account" className="mt-7">
                <p className="mono-label mb-3">Account</p>
                <ul className="list-none divide-y divide-white/6 rounded-[12px] border border-white/7 p-0">
                  <li>
                    <Link
                      to={ROUTES.orders}
                      onClick={onClose}
                      className="flex min-h-13 items-center gap-3.5 px-4 py-3 text-[15px] text-void-100 active:bg-void-800"
                    >
                      <Package aria-hidden className="size-[17px] text-void-400" />
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.wishlist}
                      onClick={onClose}
                      className="flex min-h-13 items-center gap-3.5 px-4 py-3 text-[15px] text-void-100 active:bg-void-800"
                    >
                      <Heart aria-hidden className="size-[17px] text-void-400" />
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.profile}
                      onClick={onClose}
                      className="flex min-h-13 items-center gap-3.5 px-4 py-3 text-[15px] text-void-100 active:bg-void-800"
                    >
                      <User aria-hidden className="size-[17px] text-void-400" />
                      Profile
                    </Link>
                  </li>
                </ul>
              </nav>
            )}
          </div>

          <div className="border-t border-white/7 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-void-50">{user?.displayName}</p>
                  <p className="truncate text-[12px] text-void-400">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void signOut().then(() => {
                      onClose();
                      navigate(ROUTES.home);
                    });
                  }}
                  className="h-11 shrink-0 rounded-[11px] border border-white/10 px-4 text-[13px] text-void-100"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to={ROUTES.login}
                  onClick={onClose}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[11px] border border-white/10 text-[14px] text-void-50"
                >
                  <LogIn aria-hidden className="size-4" />
                  Sign in
                </Link>
                <Link
                  to={ROUTES.register}
                  onClick={onClose}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-[11px] bg-accent-500 text-[14px] font-medium text-void-950"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
