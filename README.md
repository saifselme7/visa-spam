# VOIDCARD

A premium storefront for digital prepaid and gift card codes. React + TypeScript
+ Vite, built as a scalable e-commerce application rather than a landing page:
routing, cart, accounts, orders and a crypto-payment flow are all real, running
against a swappable service layer that is ready for Supabase.

The cybersecurity-adjacent aesthetic is **visual branding only**. The products
are ordinary prepaid/gift card codes, the card artwork is masked demo art
(`XXXX XXXX XXXX XXXX`), and no payment credentials exist anywhere in the app.

## Quick start

```bash
npm install
cp .env.example .env     # VITE_DEMO_MODE=true works out of the box
npm run dev
```

| Script              | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Dev server on :5173                                        |
| `npm run build`     | Type-check (`tsc -b`) then production build                |
| `npm run lint`      | oxlint — currently 0 warnings, 0 errors                    |
| `npm run test`      | Route render smoke test + service/flow behaviour tests     |
| `npm run preview`   | Serve the production build                                 |

**Demo account:** `demo.user@gmail.com` / `voidcard-demo` (the login screen can
fill it for you).

## Demo mode vs. real backend

`VITE_DEMO_MODE` picks the backend, and the choice is made in exactly one place
(`src/config/env.ts` → `backendMode`):

- `true` → mock catalogue, localStorage accounts/cart/wishlist, a simulated
  payment provider. A banner is pinned to the top of every page and the payment
  screen is explicitly labelled DEMO.
- `false` → the app expects Supabase credentials. Without them it reports a
  configuration error rather than silently falling back to mocks.

Demo auth in a production build is treated as a bug: `assertDemoModeSafety()`
logs a loud console error on boot. Demo mode is never a silent default.

## Architecture

```
src/
  components/   ui · layout · cards · navigation · forms · checkout · account
  pages/        one directory per route
  routes/       route table, ProtectedRoute, GuestRoute
  services/     auth · products · orders · payments · wishlist · support
  context/      Auth · Cart · Wishlist · Toast
  hooks/        useAsync, useCardTilt, useReducedMotion, useSeo, …
  types/        database.ts (Postgres shape) · domain.ts (UI shape)
  data/         mock catalogue, demo account, FAQ
  config/       env.ts (the only place env is read) · site.ts
```

Two rules keep this maintainable:

**Components never talk to a backend.** They call a service interface. Each
service has a `Mock*` and a `Supabase*` implementation and a factory that picks
one — swapping backends touches `services/`, never `pages/`.

**Rows are not domain models.** `types/database.ts` mirrors the planned Postgres
schema in snake_case; `types/domain.ts` is what the UI consumes. `services/mappers.ts`
is the only translation layer, so a schema change has one blast radius.

Errors use a `Result<T>` type rather than exceptions, and every `ServiceError.message`
is written to be safe to render directly — nothing technical leaks to users.

## Security posture

These are structural, not conventional:

- **No service method accepts a `userId`.** Ownership comes from the session.
  The mock services already enforce this so behaviour doesn't change under RLS.
- **The frontend cannot mark a payment as paid.** `PaymentService` has no such
  method. `reportPaymentSent()` is advisory — it asks the provider to look
  sooner and is proven by test not to change status. Confirmation only ever
  arrives from `pollPayment()`, i.e. from the provider.
- **No wallet addresses are generated or hardcoded.** `depositAddress` is null
  until a real provider issues one; the UI renders an explicit placeholder.
- **Gmail-only registration is enforced twice.** The client check in
  `services/auth/emailPolicy.ts` is UX; the real gate is the `handle_new_user`
  trigger documented in [`docs/supabase-rls.md`](docs/supabase-rls.md).
- **Only public config is in the bundle.** `.env.example` documents which
  variables are public and which must never appear there.

## Accessibility & motion

Semantic landmarks, a skip link, visible focus rings, labelled icon-only
controls, focus-trapped dialogs, and ≥44px touch targets on mobile.

`prefers-reduced-motion` is honoured in two layers: a global CSS rule collapses
transitions, and `useReducedMotion` lets JS-driven effects opt out entirely — the
hero parallax and card tilt don't attach listeners at all rather than animating
faster. Card tilt is also disabled for touch pointers.

## Performance

Every route is `React.lazy`-loaded; the framework and animation library are
split into long-cache chunks. Page chunks land in the 2–20 kB range. Animation
is transform/opacity only so it stays on the compositor, pointer handlers are
rAF-throttled and passive, and `ProductCard`/`DigitalCard` are memoised.

## Tests

```bash
npm run test
```

- `scripts/smoke.mjs` — mounts all 23 routes in jsdom against the real router
  and asserts each renders expected content with **zero console errors**,
  including 404, unavailable-product and protected-route redirects.
- `scripts/flows.mjs` — 35 assertions over the service layer: the Gmail
  allow-list (each rejected provider individually), unverified-login blocking,
  catalogue filtering/sorting/pagination, discount maths, order totals,
  cross-account order access, and the full payment state machine — including
  that polling alone and "I've sent it" both leave the payment `pending`.

## Connecting Supabase

See [`docs/supabase-rls.md`](docs/supabase-rls.md) for the full schema, RLS
policies, the `create_order` / `cancel_order` functions and the Edge Function
split. The short version: install the SDK, fill two env vars, implement
`getSupabaseClient()`, and fill in the `Supabase*Service` classes that already
exist and are already wired into the factories.

## Notes

VOIDCARD is a demonstration project. Brand names in the catalogue are fictional,
no real payments are processed, and the legal pages are structured placeholders
that need counsel review before any commercial use.
