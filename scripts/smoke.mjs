/**
 * Render-level smoke test.
 *
 * Boots Vite in SSR mode, mounts every route into jsdom with a memory router,
 * and asserts that each page produces real content (not a blank screen) with no
 * console errors. Run with: node scripts/smoke.mjs
 */
import { JSDOM, VirtualConsole } from 'jsdom';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { createServer } from 'vite';

const ROUTES = [
  ['/', 'Digital value'],
  ['/catalog', 'Every card'],
  ['/product/voidcard-prepaid-200', 'VOIDCARD Prepaid 200'],
  ['/product/does-not-exist', 'isn’t available'],
  ['/deals', 'Every discount'],
  ['/search?q=prepaid', 'results for'],
  ['/search?q=zzzzqqq', 'Nothing matches'],
  ['/cart', 'empty'],
  ['/checkout', 'empty'],
  ['/login', 'Sign in'],
  ['/register', 'Create your account'],
  ['/forgot-password', 'Reset your password'],
  ['/verify-email', 'Confirm your email'],
  ['/how-it-works', 'From cart to code'],
  ['/faq', 'Questions and answers'],
  ['/support', 'Get help'],
  ['/about', 'storefront for digital card codes'],
  ['/terms', 'Terms of Service'],
  ['/privacy', 'Privacy Policy'],
  ['/account', 'Sign in'], // protected -> redirected to login
  ['/account/orders', 'Sign in'],
  ['/order/whatever', 'Sign in'],
  ['/totally-missing', 'isn’t in the catalogue'],
];

const errors = [];

function makeDom(url) {
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push(`[jsdom] ${e.message}`));
  vc.on('error', (...args) => errors.push(`[console.error] ${args.join(' ')}`));

  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: `http://localhost${url}`,
    pretendToBeVisual: true,
    virtualConsole: vc,
  });

  const { window } = dom;
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  });
  window.scrollTo = () => {};
  window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
  window.cancelAnimationFrame = (id) => clearTimeout(id);
  if (!window.crypto?.randomUUID) {
    window.crypto = { ...window.crypto, randomUUID: () => '00000000-0000-4000-8000-000000000000' };
  }

  const globals = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'localStorage', 'matchMedia', 'MutationObserver', 'CSS', 'Event', 'CustomEvent', 'KeyboardEvent', 'MouseEvent'];
  for (const key of globals) {
    try {
      Object.defineProperty(globalThis, key, {
        value: window[key],
        configurable: true,
        writable: true,
      });
    } catch {
      /* some globals are read-only in this Node version; the app tolerates it */
    }
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  return dom;
}

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

let failures = 0;

for (const [url, expect] of ROUTES) {
  errors.length = 0;
  const dom = makeDom(url);

  try {
    const { renderRouteTree } = await server.ssrLoadModule('/scripts/testHarness.tsx');

    const container = dom.window.document.getElementById('root');
    const root = createRoot(container);

    await act(async () => {
      root.render(renderRouteTree(url));
    });
    // Let lazy chunks + mock service latency settle.
    for (let i = 0; i < 10; i += 1) {
      await act(async () => {
        await new Promise((r) => setTimeout(r, 120));
      });
    }

    const text = container.textContent ?? '';
    const ok = text.includes(expect);
    const clean = errors.length === 0;

    if (!ok || !clean) {
      failures += 1;
      console.log(`FAIL ${url}`);
      if (!ok) console.log(`     expected to find: ${JSON.stringify(expect)}`);
      if (!clean) errors.slice(0, 3).forEach((e) => console.log(`     ${e.slice(0, 220)}`));
      console.log(`     got: ${text.replace(/\s+/g, ' ').slice(0, 220)}`);
    } else {
      console.log(`ok   ${url}`);
    }

    await act(async () => {
      root.unmount();
    });
  } catch (error) {
    failures += 1;
    console.log(`FAIL ${url} — ${error.message}`);
  } finally {
    dom.window.close();
  }
}

await server.close();
console.log(failures === 0 ? '\nAll routes rendered.' : `\n${failures} route(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
