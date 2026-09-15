import { NavLink } from 'react-router-dom';
import { Heart, LayoutGrid, Package, UserCog } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { cn } from '@/utils/cn';

const LINKS = [
  { to: ROUTES.account, label: 'Overview', icon: LayoutGrid, end: true },
  { to: ROUTES.orders, label: 'Orders', icon: Package, end: false },
  { to: ROUTES.wishlist, label: 'Wishlist', icon: Heart, end: false },
  { to: ROUTES.profile, label: 'Profile & security', icon: UserCog, end: false },
];

export function AccountNav() {
  return (
    <nav aria-label="Account" className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
      <ul className="flex list-none gap-2 overflow-x-auto p-0 no-scrollbar lg:flex-col lg:gap-1 lg:overflow-visible">
        {LINKS.map((link) => (
          <li key={link.to} className="shrink-0 lg:shrink">
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'inline-flex h-10 w-full items-center gap-2.5 rounded-[10px] border px-3.5 text-[13.5px] whitespace-nowrap transition-colors',
                  isActive
                    ? 'border-accent-500/35 bg-accent-500/10 text-accent-400'
                    : 'border-transparent text-void-200 hover:bg-white/5 hover:text-void-50',
                )
              }
            >
              <link.icon aria-hidden className="size-4 shrink-0" />
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
