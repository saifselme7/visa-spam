import { CreditCard, Mail, ShieldCheck, Wallet } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const HOW_IT_WORKS_STEPS = [
  {
    icon: CreditCard,
    title: 'Choose a denomination',
    detail:
      'Every product page lists the face value, what you pay, where the code can be used and how fast it is issued.',
  },
  {
    icon: Wallet,
    title: 'Pay in crypto',
    detail:
      'Our payment provider issues a deposit address and an exact amount, valid for a short quote window.',
  },
  {
    icon: ShieldCheck,
    title: 'Payment is verified',
    detail:
      'The provider watches the chain and confirms the transfer. Nothing is marked paid until that confirmation arrives.',
  },
  {
    icon: Mail,
    title: 'Code is delivered',
    detail:
      'Codes are issued and emailed to the address on the order. They also stay in your account history.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="Four steps, no surprises"
          description="The whole flow is designed to be boring in the right way: clear pricing, verifiable payment, immediate delivery."
        />

        <ol className="mt-12 grid list-none gap-px overflow-hidden rounded-[14px] border border-white/7 bg-white/6 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <li key={step.title} className="relative bg-void-950 p-6">
              <div className="flex items-center justify-between">
                <span
                  aria-hidden
                  className="inline-flex size-9 items-center justify-center rounded-[10px] border border-white/8 bg-void-900 text-accent-500"
                >
                  <step.icon className="size-[17px]" />
                </span>
                <span className="font-mono text-[11px] text-void-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-5 text-[15px] font-medium">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-void-300">{step.detail}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
