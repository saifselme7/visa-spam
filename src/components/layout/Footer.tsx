import { Link } from 'react-router-dom';
import { ROUTES, site } from '@/config/site';
import { Logo } from './Logo';

const COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { to: ROUTES.catalog, label: 'All cards' },
      { to: ROUTES.deals, label: 'Deals' },
      { to: ROUTES.search, label: 'Search' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { to: ROUTES.howItWorks, label: 'How it works' },
      { to: ROUTES.faq, label: 'FAQ' },
      { to: ROUTES.support, label: 'Support' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: ROUTES.about, label: 'About' },
      { to: ROUTES.terms, label: 'Terms' },
      { to: ROUTES.privacy, label: 'Privacy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/7 bg-void-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-void-300">
              Prepaid and gift card codes, delivered digitally. Pay with stablecoins or crypto,
              redeem with the issuing brand.
            </p>
            <p className="mt-5 text-[12px] text-void-500">
              VOIDCARD is a demonstration storefront. It is not a bank and does not issue credit.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="mono-label mb-4">{column.heading}</h2>
              <ul className="list-none space-y-2.5 p-0">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-[13.5px] text-void-200 transition-colors hover:text-void-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/7 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-void-500">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-[11px] tracking-[0.12em] text-void-600 uppercase">
            Digital delivery · No physical shipping
          </p>
        </div>
      </div>
    </footer>
  );
}
