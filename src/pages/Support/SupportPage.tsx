import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, CreditCard, LifeBuoy, Package } from 'lucide-react';
import { ROUTES, site } from '@/config/site';
import { useSeo } from '@/hooks/useSeo';
import { supportService } from '@/services/support';
import type { SupportTicket, SupportTicketCategory } from '@/types/domain';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { PageHeader } from '@/components/layout/PageHeader';
import { FormError } from '@/components/forms/FormError';
import { SelectField } from '@/components/forms/SelectField';
import { TextArea } from '@/components/forms/TextArea';
import { TextField } from '@/components/forms/TextField';

const CATEGORY_OPTIONS: { value: SupportTicketCategory; label: string }[] = [
  { value: 'order', label: 'Order issue' },
  { value: 'payment', label: 'Payment issue' },
  { value: 'product', label: 'Product or redemption' },
  { value: 'account', label: 'Account and access' },
  { value: 'other', label: 'Something else' },
];

const TOPIC_SHORTCUTS = [
  {
    icon: Package,
    title: 'Order issue',
    body: 'Code not delivered, wrong denomination, or an order stuck in preparing.',
    category: 'order' as const,
  },
  {
    icon: CreditCard,
    title: 'Payment issue',
    body: 'Sent the wrong amount, paid on the wrong network, or the window expired.',
    category: 'payment' as const,
  },
  {
    icon: BookOpen,
    title: 'Redemption help',
    body: 'A code was rejected by the issuing brand, or you need usage details.',
    category: 'product' as const,
  },
];

export default function SupportPage() {
  useSeo({
    title: 'Support',
    description:
      'Get help with a VOIDCARD order, payment or code. Open a ticket and we’ll follow up by email.',
    path: ROUTES.support,
  });

  const [category, setCategory] = useState<SupportTicketCategory>('order');
  const [email, setEmail] = useState('');
  const [orderReference, setOrderReference] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<SupportTicket | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);
    setSubmitting(true);

    const result = await supportService().createTicket({
      email,
      category,
      subject,
      message,
      orderReference: orderReference || null,
    });
    setSubmitting(false);

    if (result.ok) {
      setCreated(result.data);
      setSubject('');
      setMessage('');
      setOrderReference('');
    } else if (result.error.fields) {
      setFieldErrors(result.error.fields);
    } else {
      setFormError(result.error.message);
    }
  };

  return (
    <Page atmosphere="support">
      <PageHeader
        eyebrow="Support"
        title="Get help"
        description="Most answers are in the FAQ. If you need a person, open a ticket with the order reference and we’ll reply by email."
        actions={
          <Link
            to={ROUTES.faq}
            className="inline-flex h-11 items-center rounded-[11px] border border-white/9 px-5 text-sm text-void-100 transition-colors hover:border-white/20"
          >
            Read the FAQ
          </Link>
        }
      />

      <Container>
        <ul className="grid list-none gap-4 p-0 sm:grid-cols-3">
          {TOPIC_SHORTCUTS.map((topic) => (
            <li key={topic.title}>
              <button
                type="button"
                onClick={() => {
                  setCategory(topic.category);
                  document.getElementById('ticket-form')?.scrollIntoView({ block: 'center' });
                }}
                className="h-full w-full rounded-[13px] border border-white/7 bg-void-900/50 p-5 text-left transition-colors hover:border-white/16"
              >
                <topic.icon aria-hidden className="size-4 text-accent-500" />
                <h2 className="mt-4 text-[14.5px] font-medium">{topic.title}</h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-void-300">{topic.body}</p>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section id="ticket-form" aria-labelledby="ticket-heading">
            <h2 id="ticket-heading" className="text-lg">
              Open a ticket
            </h2>

            {created && (
              <div className="mt-5 flex items-start gap-3 rounded-[13px] border border-accent-500/25 bg-accent-500/[0.06] p-4">
                <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-500" />
                <div>
                  <p className="text-[14px] font-medium text-void-50">Ticket received</p>
                  <p className="mt-1 text-[13px] text-void-300">
                    Reference{' '}
                    <span className="font-mono text-void-100">{created.reference}</span>. We’ll
                    reply to {created.email}.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={(event) => void onSubmit(event)} noValidate className="mt-6 space-y-5">
              <FormError message={formError} />

              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  label="Topic"
                  options={CATEGORY_OPTIONS}
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value as SupportTicketCategory);
                  }}
                />
                <TextField
                  label="Order reference"
                  placeholder="VC-XXXXXX"
                  hint="Optional, but it speeds things up considerably."
                  value={orderReference}
                  onChange={(event) => {
                    setOrderReference(event.target.value.toUpperCase());
                  }}
                />
              </div>

              <TextField
                label="Your email"
                type="email"
                required
                autoComplete="email"
                value={email}
                error={fieldErrors.email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />

              <TextField
                label="Subject"
                required
                value={subject}
                error={fieldErrors.subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                }}
              />

              <TextArea
                label="What happened?"
                required
                rows={6}
                value={message}
                error={fieldErrors.message}
                hint="Include what you expected, what happened instead, and any reference numbers. Never send passwords or recovery phrases."
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
              />

              <Button type="submit" size="lg" loading={submitting}>
                Submit ticket
              </Button>
            </form>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[13px] border border-white/7 bg-void-900/50 p-5">
              <LifeBuoy aria-hidden className="size-4 text-void-400" />
              <h2 className="mt-4 text-[14.5px] font-medium">Response times</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-void-300">
                Tickets are answered in the order received. Payment issues are triaged first because
                the payment window matters.
              </p>
            </div>

            <div className="rounded-[13px] border border-white/7 bg-void-900/50 p-5">
              <h2 className="text-[14.5px] font-medium">Before you write</h2>
              <ul className="mt-3 list-none space-y-2 p-0 text-[13px] leading-relaxed text-void-300">
                <li>· Check the order page — the timeline shows where it is stuck.</li>
                <li>· Have the order reference ready.</li>
                <li>· We will never ask for a password, seed phrase or private key.</li>
              </ul>
            </div>

            <div className="rounded-[13px] border border-white/7 bg-void-900/50 p-5">
              <h2 className="text-[14.5px] font-medium">Email</h2>
              <p className="mt-2 text-[13px] text-void-300">{site.supportEmail}</p>
              <Badge tone="outline" mono className="mt-3">
                Tickets preferred
              </Badge>
            </div>
          </aside>
        </div>
      </Container>
    </Page>
  );
}
