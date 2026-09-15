import { ROUTES, site } from '@/config/site';
import { useSeo } from '@/hooks/useSeo';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { PageHeader } from '@/components/layout/PageHeader';

const PRINCIPLES = [
  {
    title: 'Show the real price',
    body: 'Face value, sale price and the exact saving are visible on every product, in the cart and on the order. No fee appears late.',
  },
  {
    title: 'Never guess about money',
    body: 'A payment is confirmed by a provider or it is not confirmed at all. The storefront has no authority to decide that funds arrived.',
  },
  {
    title: 'Keep the surface small',
    body: 'We do not collect card numbers, bank details or identity documents. Less data held is less data to lose.',
  },
];

export default function AboutPage() {
  useSeo({
    title: 'About',
    description: `${site.name} is a digital storefront for prepaid and gift card codes, paid with stablecoins and crypto.`,
    path: ROUTES.about,
  });

  return (
    <Page atmosphere="legal">
      <PageHeader
        eyebrow="About"
        title="A storefront for digital card codes"
        description="VOIDCARD sells prepaid and gift card codes. You choose a denomination, pay with a supported crypto asset, and receive a redemption code by email."
        size="narrow"
      />

      <Container size="narrow">
        <div className="space-y-6 text-[14.5px] leading-relaxed text-void-200">
          <p>
            The product is intentionally narrow. We are not a wallet, not a bank, and not a
            marketplace with thousands of sellers. There is one catalogue, one checkout, and one
            delivery path.
          </p>
          <p>
            That focus is a design decision. Digital card stores usually fail in the same two
            places: payment confirmation and delivery. Both are hard to make trustworthy when the
            product surface is sprawling, so we kept it small enough to get those right.
          </p>
          <p>
            VOIDCARD is a demonstration project. The catalogue, orders and payment flow in this
            build run on local mock data, and the payment provider integration is designed but not
            connected.
          </p>
        </div>

        <section aria-labelledby="principles" className="mt-14">
          <h2 id="principles" className="mono-label mb-5">
            How we make decisions
          </h2>
          <ul className="list-none divide-y divide-white/7 border-y border-white/7 p-0">
            {PRINCIPLES.map((principle) => (
              <li key={principle.title} className="py-6">
                <h3 className="text-[15px] font-medium">{principle.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-void-300">
                  {principle.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="disclosure" className="mt-14 rounded-[14px] border border-white/7 bg-void-900/50 p-6">
          <h2 id="disclosure" className="text-[15px] font-medium">
            What we are not
          </h2>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-void-300">
            VOIDCARD does not issue credit, hold customer deposits, or provide financial services.
            Brand names in the catalogue are fictional and used to demonstrate the product surface.
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink to={ROUTES.catalog} size="lg">
            Explore cards
          </ButtonLink>
          <ButtonLink to={ROUTES.support} size="lg" variant="secondary">
            Contact support
          </ButtonLink>
        </div>
      </Container>
    </Page>
  );
}
