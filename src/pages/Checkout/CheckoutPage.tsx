import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { PAYMENT_METHODS, ROUTES } from '@/config/site';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useSeo } from '@/hooks/useSeo';
import { orderService } from '@/services/orders';
import { paymentService, type PaymentSnapshot } from '@/services/payments';
import type { CryptoAsset, Order } from '@/types/domain';
import { isEmail } from '@/utils/validation';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { PageHeader } from '@/components/layout/PageHeader';
import { CartItemRow } from '@/components/checkout/CartItemRow';
import { CheckoutStepper, type CheckoutStepIndex } from '@/components/checkout/CheckoutStepper';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PaymentMethodCard } from '@/components/checkout/PaymentMethodCard';
import { PaymentPanel } from '@/components/checkout/PaymentPanel';
import { FormError } from '@/components/forms/FormError';
import { TextField } from '@/components/forms/TextField';

/**
 * Checkout orchestration.
 *
 * Steps are local UI state; the authoritative state lives in the order and the
 * payment intent. Notably the flow never advances to "paid" on its own — step 4
 * is only reachable once the payment service reports a confirmed payment.
 */
export default function CheckoutPage() {
  useSeo({
    title: 'Checkout',
    description: 'Complete your VOIDCARD order and choose a payment asset.',
    path: ROUTES.checkout,
    noIndex: true,
  });

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { lines, totals, increment, decrement, removeItem, maxQuantity, clear } = useCart();

  const [step, setStep] = useState<CheckoutStepIndex>(0);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [asset, setAsset] = useState<CryptoAsset>('USDT');
  const [order, setOrder] = useState<Order | null>(null);
  const [snapshot, setSnapshot] = useState<PaymentSnapshot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.preferences.preferredAsset) setAsset(user.preferences.preferredAsset);
  }, [user]);

  // When the provider reports a confirmed payment, move to confirmation.
  useEffect(() => {
    if (snapshot?.intent.status === 'paid' && order) {
      clear();
      setStep(4);
      navigate(ROUTES.order(order.id), { replace: true });
    }
  }, [snapshot?.intent.status, order, clear, navigate]);

  if (lines.length === 0 && !order) {
    return (
      <Page atmosphere="checkout">
        <PageHeader eyebrow="Checkout" title="Nothing to check out" />
        <Container>
          <EmptyState
            icon={<ShoppingBag />}
            title="Your cart is empty"
            description="Add a card to the cart before starting checkout."
            action={
              <ButtonLink to={ROUTES.catalog} size="sm">
                Explore cards
              </ButtonLink>
            }
          />
        </Container>
      </Page>
    );
  }

  const onContinueDetails = () => {
    if (!isEmail(email)) {
      setEmailError('Enter a valid email address so we can deliver your codes.');
      return;
    }
    setEmailError(null);
    setStep(2);
  };

  const onCreatePayment = async () => {
    setFormError(null);

    if (!isAuthenticated) {
      navigate(ROUTES.login, { state: { from: ROUTES.checkout } });
      return;
    }

    setSubmitting(true);
    const created = order
      ? { ok: true as const, data: order }
      : await orderService().createOrder({ items: lines, contactEmail: email });

    if (!created.ok) {
      setSubmitting(false);
      setFormError(created.error.message);
      return;
    }
    setOrder(created.data);

    const intent = await paymentService().createIntent({
      orderId: created.data.id,
      method: asset,
    });
    setSubmitting(false);

    if (!intent.ok) {
      setFormError(intent.error.message);
      return;
    }

    setSnapshot(intent.data);
    setStep(3);
  };

  return (
    <Page atmosphere="checkout">
      <PageHeader
        eyebrow="Checkout"
        title="Complete your order"
        description="Five short steps. Nothing is charged until you send the payment yourself."
      />

      <Container>
        <CheckoutStepper current={step} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            {step === 0 && (
              <section aria-label="Review cart">
                <h2 className="text-lg">Review your cart</h2>
                <ul className="mt-4 list-none divide-y divide-white/7 border-y border-white/7 p-0">
                  {lines.map((line) => (
                    <CartItemRow
                      key={line.productId}
                      line={line}
                      maxQuantity={maxQuantity}
                      onIncrement={increment}
                      onDecrement={decrement}
                      onRemove={removeItem}
                    />
                  ))}
                </ul>
                <div className="mt-6 flex justify-between gap-3">
                  <ButtonLink to={ROUTES.catalog} variant="ghost" iconLeft={<ArrowLeft />}>
                    Keep browsing
                  </ButtonLink>
                  <Button
                    onClick={() => {
                      setStep(1);
                    }}
                  >
                    Continue
                  </Button>
                </div>
              </section>
            )}

            {step === 1 && (
              <section aria-label="Your details" className="max-w-md">
                <h2 className="text-lg">Where should the codes go?</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-void-300">
                  Codes are emailed here and also kept in your account history.
                </p>

                <div className="mt-6 space-y-5">
                  <TextField
                    label="Delivery email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    error={emailError}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setEmailError(null);
                    }}
                  />

                  {!isAuthenticated && (
                    <p className="rounded-[11px] border border-white/8 bg-void-900/60 p-3.5 text-[13px] leading-relaxed text-void-300">
                      You’ll need an account to place the order — orders are tied to an account so
                      you can retrieve codes later.{' '}
                      <Link
                        to={ROUTES.login}
                        state={{ from: ROUTES.checkout }}
                        className="text-accent-500 hover:underline"
                      >
                        Sign in
                      </Link>{' '}
                      or{' '}
                      <Link to={ROUTES.register} className="text-accent-500 hover:underline">
                        create one
                      </Link>
                      .
                    </p>
                  )}
                </div>

                <div className="mt-7 flex justify-between gap-3">
                  <Button
                    variant="ghost"
                    iconLeft={<ArrowLeft />}
                    onClick={() => {
                      setStep(0);
                    }}
                  >
                    Back
                  </Button>
                  <Button onClick={onContinueDetails}>Continue</Button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section aria-label="Payment method" className="max-w-lg">
                <h2 className="text-lg">Choose how to pay</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-void-300">
                  Payment instructions are issued by our payment provider after you continue.
                </p>

                <div
                  role="radiogroup"
                  aria-label="Payment asset"
                  className="mt-6 grid gap-3 sm:grid-cols-2"
                >
                  {PAYMENT_METHODS.filter((method) => method.enabled).map((method) => (
                    <PaymentMethodCard
                      key={method.asset}
                      method={method}
                      selected={asset === method.asset}
                      onSelect={setAsset}
                    />
                  ))}
                </div>

                <div className="mt-6">
                  <FormError message={formError} />
                </div>

                <div className="mt-6 flex justify-between gap-3">
                  <Button
                    variant="ghost"
                    iconLeft={<ArrowLeft />}
                    onClick={() => {
                      setStep(1);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    loading={submitting}
                    onClick={() => {
                      void onCreatePayment();
                    }}
                  >
                    Create payment
                  </Button>
                </div>
              </section>
            )}

            {step === 3 && snapshot && (
              <section aria-label="Payment status">
                <PaymentPanel
                  snapshot={snapshot}
                  onSnapshot={setSnapshot}
                  onCancel={() => {
                    void paymentService()
                      .cancelPayment(snapshot.intent.id)
                      .then((result) => {
                        if (result.ok) {
                          setSnapshot(result.data);
                          setStep(2);
                        }
                      });
                  }}
                />
                {order && (
                  <p className="mt-4 text-[12.5px] text-void-400">
                    You can leave this page — the order stays in{' '}
                    <Link to={ROUTES.orders} className="text-accent-500 hover:underline">
                      your order history
                    </Link>{' '}
                    and updates there too.
                  </p>
                )}
              </section>
            )}
          </div>

          <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
            <OrderSummary
              totals={
                order
                  ? {
                      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
                      subtotal: order.subtotal,
                      discount: order.discount,
                      total: order.total,
                      currency: order.currency,
                    }
                  : totals
              }
            >
              {order && (
                <p className="font-mono text-[11px] tracking-[0.1em] text-void-400 uppercase">
                  Order {order.reference}
                </p>
              )}
            </OrderSummary>
          </div>
        </div>
      </Container>
    </Page>
  );
}
