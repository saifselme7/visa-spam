import { ArrowRight, Percent } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { usePointerParallax } from '@/hooks/useParallax';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { DigitalCard } from '@/components/cards/DigitalCard';

/**
 * Cinematic hero: three card planes at different depths, driven by a single
 * pointer offset. Only transforms animate, and the whole effect is skipped when
 * the user prefers reduced motion.
 */
export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const parallax = usePointerParallax();

  const layer = (depth: number) => ({
    transform: `translate3d(${(parallax.x * depth).toFixed(2)}px, ${(parallax.y * depth).toFixed(2)}px, 0)`,
    transition: reducedMotion ? 'none' : 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
  });

  return (
    <section className="relative isolate overflow-hidden pt-16 pb-20 sm:pt-24 lg:pt-28 lg:pb-28">
      {/* Cinematic lighting + technical grid, masked so it never dominates */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(85%_55%_at_72%_-5%,rgba(77,224,192,0.13),transparent_58%),radial-gradient(60%_45%_at_15%_10%,rgba(93,138,224,0.10),transparent_60%)]"
      />
      <div
        aria-hidden
        className="grid-backdrop pointer-events-none absolute inset-0 -z-10 opacity-[0.4] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="noise pointer-events-none absolute inset-0 -z-10 opacity-40"
      />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
          <div className="max-w-xl">
            <p className="mono-label mb-5 flex items-center gap-2.5">
              <span className="inline-block size-1.5 rounded-full bg-accent-500" />
              Prepaid & gift cards
            </p>

            <h1 className="text-[40px] leading-[1.04] tracking-[-0.03em] sm:text-[56px] lg:text-[62px]">
              Digital value.
              <br />
              <span className="text-void-300">Without the noise.</span>
            </h1>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-void-200 sm:text-base">
              Pick a denomination, pay with stablecoins or crypto, get your code by email. No
              accounts to link, no physical shipping, no upsells.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink to={ROUTES.catalog} size="lg" iconRight={<ArrowRight />}>
                Explore cards
              </ButtonLink>
              <ButtonLink to={ROUTES.deals} size="lg" variant="secondary" iconLeft={<Percent />}>
                View deals
              </ButtonLink>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/7 pt-6">
              {[
                { term: 'Delivery', detail: 'Email, minutes after confirmation' },
                { term: 'Payment', detail: 'USDT · USDC · BTC · ETH' },
                { term: 'Denominations', detail: '$25 – $500' },
              ].map((item) => (
                <div key={item.term}>
                  <dt className="mono-label">{item.term}</dt>
                  <dd className="mt-1.5 text-[12.5px] leading-snug text-void-200">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Card composition */}
          <div className="relative mx-auto h-[340px] w-full max-w-[560px] sm:h-[420px] lg:h-[500px]">
            <div
              className="absolute top-[6%] left-[2%] w-[58%] opacity-70"
              style={layer(-16)}
              aria-hidden
            >
              <DigitalCard theme="ice" value={50} label="PREPAID" interactive={false} size="sm" />
            </div>

            <div
              className="absolute right-[1%] bottom-[4%] w-[62%] opacity-80"
              style={layer(22)}
              aria-hidden
            >
              <DigitalCard
                theme="copper"
                value={100}
                label="PREPAID"
                interactive={false}
                size="sm"
              />
            </div>

            <div
              className="absolute top-1/2 left-1/2 w-[76%] -translate-x-1/2 -translate-y-1/2"
              style={layer(-34)}
            >
              <DigitalCard
                theme="titanium"
                value={200}
                label="PREPAID"
                network="VOID NETWORK"
                size="lg"
                className="max-w-none"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
