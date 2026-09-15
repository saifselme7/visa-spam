import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/site';
import { faqEntries, type FaqEntry } from '@/data/faq';
import { useSeo } from '@/hooks/useSeo';
import { Accordion } from '@/components/ui/Accordion';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/utils/cn';

const TOPICS: { value: FaqEntry['topic'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'cards', label: 'Cards' },
  { value: 'checkout', label: 'Checkout' },
  { value: 'payments', label: 'Payments' },
  { value: 'orders', label: 'Orders' },
  { value: 'refunds', label: 'Refunds' },
  { value: 'account', label: 'Account' },
];

export default function FaqPage() {
  useSeo({
    title: 'FAQ',
    description:
      'How prepaid codes work, how crypto checkout is verified, delivery times, refunds and account security.',
    path: ROUTES.faq,
  });

  const [topic, setTopic] = useState<FaqEntry['topic'] | 'all'>('all');

  const items = useMemo(
    () =>
      faqEntries
        .filter((entry) => topic === 'all' || entry.topic === topic)
        .map((entry) => ({ id: entry.id, question: entry.question, answer: entry.answer })),
    [topic],
  );

  return (
    <Page atmosphere="support">
      <PageHeader
        eyebrow="FAQ"
        title="Questions and answers"
        description="If something here is unclear or missing, open a support ticket and we’ll add it."
        size="narrow"
      />

      <Container size="narrow">
        <div role="tablist" aria-label="FAQ topics" className="flex flex-wrap gap-2">
          {TOPICS.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={topic === item.value}
              onClick={() => {
                setTopic(item.value);
              }}
              className={cn(
                'h-9 rounded-[9px] border px-3.5 text-[13px] transition-colors',
                topic === item.value
                  ? 'border-accent-500/40 bg-accent-500/12 text-accent-400'
                  : 'border-white/9 text-void-200 hover:border-white/20 hover:text-void-50',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <Accordion className="mt-8" items={items} />

        <div className="mt-12 rounded-[14px] border border-white/7 bg-void-900/50 p-6">
          <h2 className="text-[15px] font-medium">Still stuck?</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-void-300">
            Open a ticket with your order reference and we’ll pick it up from there.
          </p>
          <Link
            to={ROUTES.support}
            className="mt-4 inline-flex h-10 items-center rounded-[10px] bg-accent-500 px-4 text-[13.5px] font-medium text-void-950"
          >
            Contact support
          </Link>
        </div>
      </Container>
    </Page>
  );
}
