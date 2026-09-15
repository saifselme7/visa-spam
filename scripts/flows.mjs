/**
 * Behaviour test for the demo flows that matter most:
 * Gmail-only registration, demo sign-in, cart maths, order creation, and the
 * payment state machine (including the rule that the client cannot self-confirm).
 * Run with: node scripts/flows.mjs
 */
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
Object.defineProperty(globalThis, 'window', { value: dom.window, configurable: true });
Object.defineProperty(globalThis, 'document', { value: dom.window.document, configurable: true });
Object.defineProperty(globalThis, 'localStorage', { value: dom.window.localStorage, configurable: true });

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });

let failed = 0;
const check = (name, condition, detail = '') => {
  if (condition) console.log(`ok   ${name}`);
  else {
    failed += 1;
    console.log(`FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
};

const { checkRegistrationEmail } = await server.ssrLoadModule('/src/services/auth/emailPolicy.ts');
const { authService } = await server.ssrLoadModule('/src/services/auth/authService.ts');
const { productService } = await server.ssrLoadModule('/src/services/products/index.ts');
const { orderService } = await server.ssrLoadModule('/src/services/orders/orderService.ts');
const { paymentService } = await server.ssrLoadModule('/src/services/payments/paymentService.ts');
const { DEMO_CREDENTIALS } = await server.ssrLoadModule('/src/data/demoAccount.ts');

/* ---------------------------- email policy ---------------------------- */
for (const bad of ['a@yahoo.com', 'a@outlook.com', 'a@hotmail.com', 'a@icloud.com', 'a@proton.me', 'nope']) {
  check(`rejects ${bad}`, checkRegistrationEmail(bad).valid === false);
}
check('accepts gmail', checkRegistrationEmail('Someone@Gmail.com').valid === true);
check('normalises gmail', checkRegistrationEmail(' Someone@Gmail.com ').normalized === 'someone@gmail.com');

/* ------------------------------- auth --------------------------------- */
const auth = authService();
const badLogin = await auth.signIn({ email: DEMO_CREDENTIALS.email, password: 'wrong' });
check('wrong password rejected', badLogin.ok === false);

const signUpBlocked = await auth.signUp({ email: 'x@yahoo.com', password: 'Str0ngPass', displayName: 'X' });
check('signUp enforces gmail', signUpBlocked.ok === false && signUpBlocked.error.code === 'validation');

const signUpWeak = await auth.signUp({ email: 'newperson@gmail.com', password: 'abc', displayName: 'New' });
check('signUp rejects weak password', signUpWeak.ok === false);

const signUpOk = await auth.signUp({ email: 'newperson@gmail.com', password: 'Str0ngPass1', displayName: 'New' });
check('signUp succeeds and needs verification', signUpOk.ok === true && signUpOk.data.requiresVerification === true);

const unverified = await auth.signIn({ email: 'newperson@gmail.com', password: 'Str0ngPass1' });
check('unverified cannot sign in', unverified.ok === false);

const login = await auth.signIn(DEMO_CREDENTIALS);
check('demo account signs in', login.ok === true, login.ok ? '' : login.error.message);

/* ----------------------------- catalogue ------------------------------ */
const list = await productService().listProducts({ pageSize: 9 });
check('catalogue paginates', list.ok && list.data.items.length === 9 && list.data.total === 18);

const filtered = await productService().listProducts({ categories: ['gaming'] });
check('category filter works', filtered.ok && filtered.data.items.every((p) => p.categorySlug === 'gaming'));

const sorted = await productService().listProducts({ sort: 'price-asc', pageSize: 18 });
const prices = sorted.ok ? sorted.data.items.map((p) => p.price) : [];
check('price sort works', prices.every((v, i) => i === 0 || prices[i - 1] <= v));

const missing = await productService().getProduct('nope');
check('missing product returns not_found', missing.ok === false && missing.error.code === 'not_found');

const p200 = await productService().getProduct('voidcard-prepaid-200');
check('discount maths', p200.ok && p200.data.savings === 11 && p200.data.discountPercent === 6);

/* ------------------------------- orders ------------------------------- */
const line = {
  productId: p200.data.id, slug: p200.data.slug, name: p200.data.name,
  faceValue: p200.data.faceValue, unitPrice: p200.data.price, quantity: 2,
  theme: p200.data.art.theme, currency: 'USD',
};
const order = await orderService().createOrder({ items: [line], contactEmail: DEMO_CREDENTIALS.email });
check('order created', order.ok === true, order.ok ? '' : order.error.message);
check('order totals', order.ok && order.data.total === 378 && order.data.subtotal === 400 && order.data.discount === 22);
check('order starts pending', order.ok && order.data.orderStatus === 'pending' && order.data.paymentStatus === 'pending');

const foreign = await orderService().getOrder('o0000000-0000-4000-8000-00000000ffff');
check('unknown order is not_found', foreign.ok === false && foreign.error.code === 'not_found');

/* ------------------------------ payments ------------------------------ */
const intent = await paymentService().createIntent({ orderId: order.data.id, method: 'USDT' });
check('intent created', intent.ok === true, intent.ok ? '' : intent.error.message);
check('intent has no hardcoded address', intent.ok && intent.data.intent.depositAddress === null);
check('intent quotes an amount', intent.ok && typeof intent.data.intent.cryptoAmount === 'string');
check('intent starts pending', intent.ok && intent.data.intent.status === 'pending');

// Polling before the customer reports anything must NOT advance the state.
const idle = await paymentService().pollPayment(intent.data.intent.id);
check('polling alone does not confirm', idle.ok && idle.data.intent.status === 'pending');

// "I've sent it" is advisory: it must not mark the payment paid by itself.
const reported = await paymentService().reportPaymentSent(intent.data.intent.id);
check('reporting does not mark paid', reported.ok && reported.data.intent.status === 'pending');

// The simulated provider detects, then confirms, on its own clock.
await new Promise((r) => setTimeout(r, 4500));
const detected = await paymentService().pollPayment(intent.data.intent.id);
check('provider detects payment', detected.ok && detected.data.intent.status === 'processing');

const midOrder = await orderService().getOrder(order.data.id);
check('order follows payment to processing', midOrder.ok && midOrder.data.orderStatus === 'payment_processing');

await new Promise((r) => setTimeout(r, 7000));
const confirmed = await paymentService().pollPayment(intent.data.intent.id);
check('provider confirms payment', confirmed.ok && confirmed.data.intent.status === 'paid');

const finalOrder = await orderService().getOrder(order.data.id);
check('paid order moves to preparing', finalOrder.ok && finalOrder.data.orderStatus === 'preparing' && finalOrder.data.paymentStatus === 'paid');

const lateCancel = await orderService().cancelOrder(order.data.id);
check('paid order cannot be cancelled', lateCancel.ok === false && lateCancel.error.code === 'conflict');

/* ------------------------------ sign out ------------------------------ */
await auth.signOut();
const afterSignOut = await orderService().listOrders();
check('orders require a session', afterSignOut.ok === false && afterSignOut.error.code === 'unauthorized');

await server.close();
console.log(failed === 0 ? '\nAll flow checks passed.' : `\n${failed} check(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
