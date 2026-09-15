import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/utils/cn';
import { IconButton } from '@/components/ui/IconButton';
import { SearchBar } from '@/components/navigation/SearchBar';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

const PRIMARY_LINKS = [
  { to: ROUTES.catalog, label: 'Shop' },
  { to: ROUTES.deals, label: 'Deals' },
  { to: ROUTES.howItWorks, label: 'How It Works' },
  { to: ROUTES.support, label: 'Support' },
];

export interface NavbarProps {
  onOpenCart: () => void;
}

export function Navbar({ onOpenCart }: NavbarProps) {
  const location = useLocation();
  const { totals } = useCart();
  const { isAuthenticated } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Close the overlays whenever the route changes. Guarded so a navigation that
  // leaves both closed does not schedule a redundant render.
  const routeKey = `${location.pathname}${location.search}`;
  useEffect(() => {
    // `routeKey` is read so the effect re-runs whenever the URL changes.
    void routeKey;
    setSearchOpen((open) => (open ? false : open));
    setMenuOpen((open) => (open ? false : open));
  }, [routeKey]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-70 transition-colors duration-300',
          scrolled
            ? 'border-b border-white/7 bg-void-950/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav aria-label="Primary" className="ml-6 hidden lg:block">
            <ul className="flex list-none items-center gap-1 p-0">
              {PRIMARY_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'relative inline-flex h-9 items-center rounded-[9px] px-3 text-[13.5px] transition-colors duration-200',
                        isActive
                          ? 'text-void-50'
                          : 'text-void-200 hover:bg-white/5 hover:text-void-50',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {isActive && (
                          <span
                            aria-hidden
                            className="absolute inset-x-3 -bottom-px h-px bg-accent-500"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <IconButton
              size="sm"
              label={searchOpen ? 'Close search' : 'Search'}
              icon={<Search />}
              tone={searchOpen ? 'active' : 'default'}
              aria-expanded={searchOpen}
              onClick={() => {
                setSearchOpen((open) => !open);
              }}
            />

            <NavLink to={isAuthenticated ? ROUTES.account : ROUTES.login} className="hidden sm:block">
              {({ isActive }) => (
                <span
                  className={cn(
                    'inline-flex size-9 items-center justify-center rounded-[10px] border transition-colors',
                    isActive
                      ? 'border-accent-500/40 bg-accent-500/12 text-accent-400'
                      : 'border-white/8 bg-void-850/60 text-void-100 hover:border-white/18 hover:text-void-50',
                  )}
                >
                  <User aria-hidden className="size-[18px]" />
                  <span className="sr-only">{isAuthenticated ? 'Account' : 'Sign in'}</span>
                </span>
              )}
            </NavLink>

            <button
              type="button"
              onClick={onOpenCart}
              className="relative inline-flex h-9 items-center gap-2 rounded-[10px] border border-white/8 bg-void-850/60 px-3 text-[13px] text-void-100 transition-colors hover:border-white/18 hover:text-void-50"
            >
              <ShoppingBag aria-hidden className="size-[17px]" />
              <span className="tabular">{totals.itemCount}</span>
              <span className="sr-only">
                items in cart — open cart
              </span>
            </button>

            <IconButton
              size="sm"
              label="Open menu"
              icon={<Menu />}
              className="lg:hidden"
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen(true);
              }}
            />
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-white/7 bg-void-950/95 backdrop-blur-xl">
            <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
              <SearchBar
                autoFocus
                onSubmitted={() => {
                  setSearchOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
        }}
      />
    </>
  );
}
