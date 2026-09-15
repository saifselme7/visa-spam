import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const POINTS = [
  {
    title: 'The price is the price',
    body: 'What you see on the product page is what you pay. No fees appear at the last step of checkout.',
  },
  {
    title: 'Payment you can verify',
    body: 'Crypto settlement is confirmed on-chain by a payment provider before an order moves forward. We never mark an order paid on trust.',
  },
  {
    title: 'Codes stay in your account',
    body: 'Orders and delivered codes remain in your history, so you can find them again without digging through email.',
  },
  {
    title: 'Support that sees the order',
    body: 'Tickets are attached to the order reference, so you never have to re-explain the situation from scratch.',
  },
];

export function WhySection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <SectionHeading
            eyebrow="Why VOIDCARD"
            title="Built around the part that usually goes wrong"
            description="Most digital card stores fall down at payment and delivery. That is where we put the effort."
            className="self-start"
          />

          <ul className="list-none divide-y divide-white/7 border-y border-white/7 p-0">
            {POINTS.map((point) => (
              <li key={point.title} className="py-6 first:pt-0 last:pb-0">
                <h3 className="text-[15px] font-medium">{point.title}</h3>
                <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-void-300">
                  {point.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
