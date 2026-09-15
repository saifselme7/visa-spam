import { ArrowRight } from 'lucide-react';
import { ROUTES, site } from '@/config/site';
import { faqEntries } from '@/data/faq';
import { useAsync } from '@/hooks/useAsync';
import { useSeo } from '@/hooks/useSeo';
import { productService } from '@/services/products';
import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Container } from '@/components/layout/Container';
import { ProductGrid } from '@/components/cards/ProductGrid';
import { ProductGridSkeleton } from '@/components/cards/ProductCardSkeleton';
import { HeroSection } from './HeroSection';
import { HowItWorksSection } from './HowItWorksSection';
import { SecureCheckoutSection } from './SecureCheckoutSection';
import { WhySection } from './WhySection';

export default function HomePage() {
  useSeo({
    title: site.name,
    description: site.description,
    path: ROUTES.home,
  });

  const featured = useAsync(() => productService().listFeatured(6), []);
  const deals = useAsync(() => productService().listDeals(3), []);

  const homeFaq = faqEntries
    .filter((entry) => ['checkout-steps', 'crypto-flow', 'delivery-time', 'refunds'].includes(entry.id))
    .map((entry) => ({ id: entry.id, question: entry.question, answer: entry.answer }));

  return (
    <div className="relative">
      <HeroSection />

      <section className="py-20 sm:py-24" aria-labelledby="featured-heading">
        <Container>
          <SectionHeading
            eyebrow="Featured"
            title="Cards people actually buy"
            description="A short list of the denominations that move fastest."
            action={
              <ButtonLink to={ROUTES.catalog} variant="secondary" size="sm" iconRight={<ArrowRight />}>
                All cards
              </ButtonLink>
            }
          />
          <div className="mt-10" id="featured-heading">
            {featured.loading && <ProductGridSkeleton count={6} />}
            {featured.error && <ErrorState error={featured.error} onRetry={featured.reload} />}
            {featured.data && <ProductGrid products={featured.data} />}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="deals-heading">
        <Container>
          <SectionHeading
            eyebrow="Best deals"
            title="Where the saving is largest"
            description="Discounts are set per denomination and change as batches are issued."
            action={
              <ButtonLink to={ROUTES.deals} variant="secondary" size="sm" iconRight={<ArrowRight />}>
                All deals
              </ButtonLink>
            }
          />
          <div className="mt-10" id="deals-heading">
            {deals.loading && <ProductGridSkeleton count={3} />}
            {deals.error && <ErrorState error={deals.error} onRetry={deals.reload} />}
            {deals.data && <ProductGrid products={deals.data} />}
          </div>
        </Container>
      </section>

      <HowItWorksSection />
      <WhySection />
      <SecureCheckoutSection />

      <section className="py-20 sm:py-24" aria-labelledby="faq-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <SectionHeading
              eyebrow="FAQ"
              title="Questions worth answering first"
              description="The full list covers redemption, refunds and account security."
              action={
                <ButtonLink to={ROUTES.faq} variant="link" size="sm" iconRight={<ArrowRight />}>
                  Read the full FAQ
                </ButtonLink>
              }
              className="self-start"
            />
            <div id="faq-heading">
              <Accordion items={homeFaq} />
            </div>
          </div>
        </Container>
      </section>

      <section className="pt-8 pb-4">
        <Container>
          <div className="relative overflow-hidden rounded-[18px] border border-white/8 bg-void-900/60 px-8 py-14 text-center sm:px-14 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(77,224,192,0.12),transparent_62%)]"
            />
            <div
              aria-hidden
              className="grid-backdrop pointer-events-none absolute inset-0 opacity-25"
            />
            <div className="relative mx-auto max-w-xl">
              <h2 className="text-[28px] leading-tight sm:text-[34px]">
                Find the denomination you need
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-void-200">
                Eighteen products across prepaid, retail, gaming, streaming and travel.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink to={ROUTES.catalog} size="lg" iconRight={<ArrowRight />}>
                  Explore cards
                </ButtonLink>
                <ButtonLink to={ROUTES.howItWorks} size="lg" variant="secondary">
                  How it works
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
