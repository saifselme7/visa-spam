import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useSeo } from '@/hooks/useSeo';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { PageHeader } from '@/components/layout/PageHeader';
import { DigitalCard } from '@/components/cards/DigitalCard';
import { HOW_IT_WORKS_STEPS } from '@/pages/Home/HowItWorksSection';

const DETAIL_SECTIONS = [
  {
    heading: 'What a code is',
    body: 'Every product is a redemption code for a prepaid balance or store credit. Nothing physical ships and no bank account is involved. The code is entered at the issuing brand’s checkout or account page, where the balance is applied.',
  },
  {
    heading: 'Why crypto',
    body: 'Crypto settlement lets us confirm a payment without holding card details or routing through a card network. It also means a payment is either confirmed on-chain or it is not — there is no ambiguous middle state to argue about later.',
  },
  {
    heading: 'What happens after you pay',
    body: 'The payment provider watches for your transfer and reports confirmations back to us. Once the required confirmations are reached, the order moves to preparing, codes are issued, and they are emailed to the address on the order and stored in your account.',
  },
  {
    heading: 'If something goes wrong',
    body: 'Underpayments, wrong-network transfers and expired quotes all have a defined path. Open a ticket with the order reference; support can see the order and the provider events attached to it.',
  },
];

export default function HowItWorksPage() {
  useSeo({
    title: 'How it works',
    description:
      'How VOIDCARD prepaid codes are bought, how crypto payments are verified, and how delivery works.',
    path: ROUTES.howItWorks,
  });

  return (
    <Page atmosphere="support">
      <PageHeader
        eyebrow="How it works"
        title="From cart to code"
        description="A short walk through the whole flow, including the parts that usually get glossed over."
      />

      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-16">
          <ol className="list-none space-y-0 p-0">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative border-b border-white/7 py-7 first:pt-0 last:border-0"
              >
                <div className="flex gap-5">
                  <span className="mt-0.5 font-mono text-[12px] text-void-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="text-[16px] font-medium">{step.title}</h2>
                    <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-void-300">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:self-start">
            <DigitalCard theme="aurora" value={100} label="PREPAID" size="md" />
            <p className="mt-6 text-[12px] leading-relaxed text-void-500">
              Card artwork is illustrative. Products are delivered as redemption codes — no physical
              card is issued and no payment credentials are ever displayed.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[14px] border border-white/7 bg-white/6 sm:grid-cols-2">
          {DETAIL_SECTIONS.map((section) => (
            <section key={section.heading} className="bg-void-950 p-6 sm:p-7">
              <h2 className="text-[15px] font-medium">{section.heading}</h2>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-void-300">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink to={ROUTES.catalog} size="lg" iconRight={<ArrowRight />}>
            Explore cards
          </ButtonLink>
          <ButtonLink to={ROUTES.faq} size="lg" variant="secondary">
            Read the FAQ
          </ButtonLink>
        </div>
      </Container>
    </Page>
  );
}
