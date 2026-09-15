import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/site';
import { useSeo } from '@/hooks/useSeo';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { DigitalCard } from '@/components/cards/DigitalCard';

const SUGGESTIONS = [
  { to: ROUTES.catalog, label: 'Catalogue' },
  { to: ROUTES.deals, label: 'Deals' },
  { to: ROUTES.howItWorks, label: 'How it works' },
  { to: ROUTES.support, label: 'Support' },
];

export default function NotFoundPage() {
  useSeo({
    title: 'Page not found',
    description: 'The page you were looking for does not exist.',
    path: '/404',
    noIndex: true,
  });

  return (
    <Page atmosphere="error">
      <Container className="flex min-h-[70vh] items-center py-20">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[12px] tracking-[0.2em] text-void-500 uppercase">
              Error 404
            </p>
            <h1 className="mt-4 text-[34px] leading-[1.1] sm:text-[44px]">
              This page isn’t in the catalogue
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-void-300">
              The link may be out of date, or the product it pointed to has been retired.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to={ROUTES.home} size="lg">
                Back to home
              </ButtonLink>
              <ButtonLink to={ROUTES.catalog} size="lg" variant="secondary">
                Browse cards
              </ButtonLink>
            </div>

            <nav aria-label="Suggested pages" className="mt-10">
              <p className="mono-label mb-3">Or try</p>
              <ul className="flex list-none flex-wrap gap-2 p-0">
                {SUGGESTIONS.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="inline-flex h-9 items-center rounded-[9px] border border-white/9 px-3.5 text-[13px] text-void-200 transition-colors hover:border-white/20 hover:text-void-50"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* A card with no denomination — restrained visual joke, no glow */}
          <div className="flex justify-center lg:justify-end">
            <DigitalCard theme="obsidian" label="NOT FOUND" network="—" size="md" />
          </div>
        </div>
      </Container>
    </Page>
  );
}
