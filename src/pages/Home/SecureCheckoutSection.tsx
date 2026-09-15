import { KeyRound, Lock, ServerCog } from 'lucide-react';
import { PAYMENT_METHODS } from '@/config/site';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const PRINCIPLES = [
  {
    icon: Lock,
    title: 'No card details collected',
    body: 'Checkout never asks for a card number, CVV or bank credentials. Payment happens through a crypto payment provider.',
  },
  {
    icon: ServerCog,
    title: 'Verification happens server-side',
    body: 'Confirmations are read from the provider by our backend. The browser cannot mark an order as paid.',
  },
  {
    icon: KeyRound,
    title: 'Access is scoped to your account',
    body: 'Orders and codes are readable only by the account that created them, enforced in the database.',
  },
];

export function SecureCheckoutSection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="overflow-hidden rounded-[16px] border border-white/7 bg-void-900/40">
          <div className="grid gap-px bg-white/6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="bg-void-950 p-8 sm:p-10">
              <SectionHeading
                eyebrow="Secure checkout"
                title="Payment handled by a provider, not by this page"
                description="The storefront collects what you want to buy and where to send it. Everything involving money is delegated to a payment provider and verified before anything is issued."
              />

              <ul className="mt-9 list-none space-y-6 p-0">
                {PRINCIPLES.map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-[9px] border border-white/8 bg-void-900 text-accent-500"
                    >
                      <item.icon className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-[14px] font-medium">{item.title}</h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-void-300">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-void-950 p-8 sm:p-10">
              <h3 className="mono-label mb-6">Supported payment methods</h3>
              <ul className="list-none space-y-px overflow-hidden rounded-[12px] border border-white/7 p-0">
                {PAYMENT_METHODS.map((method) => (
                  <li
                    key={method.asset}
                    className="flex items-center justify-between gap-4 bg-void-900/60 px-4 py-3.5"
                  >
                    <div>
                      <p className="text-[14px] text-void-50">
                        {method.asset}
                        <span className="ml-2 text-[12px] text-void-400">{method.name}</span>
                      </p>
                      <p className="mono-label mt-1">{method.network}</p>
                    </div>
                    <p className="shrink-0 text-right text-[12px] text-void-300">
                      {method.estimatedSettlement}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[12px] leading-relaxed text-void-500">
                Settlement times are provider estimates and depend on network conditions. Always
                send on the network shown at checkout.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
