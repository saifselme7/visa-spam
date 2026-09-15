# Supabase integration & Row Level Security plan

This is the contract the frontend was written against. Nothing here is applied
yet — no Supabase project is connected — but the service interfaces in
`src/services/*` assume exactly these guarantees, so implementing this document
should require no UI changes.

## Guiding rules

1. **The client never asserts identity.** No service method accepts a `userId`.
   Ownership is always derived from `auth.uid()` server-side. The mock services
   already behave this way (see `MockOrderService.currentUserId`) so the
   behaviour does not change when the real backend arrives.
2. **The client never asserts that money moved.** There is deliberately no
   "mark paid" method on `PaymentService`. Payment status is written only by the
   provider webhook or an Edge Function after independent on-chain verification.
3. **The client never re-prices an order.** `create_order` recomputes every line
   from `products` server-side. Prices in the cart are display values only.
4. **Secrets stay server-side.** Only the anon key reaches the browser. The
   service-role key, provider API keys and any wallet material live in Edge
   Function secrets.

## Enable RLS everywhere

```sql
alter table public.profiles             enable row level security;
alter table public.categories           enable row level security;
alter table public.products             enable row level security;
alter table public.inventory            enable row level security;
alter table public.orders               enable row level security;
alter table public.order_items          enable row level security;
alter table public.payments             enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.wishlists            enable row level security;
alter table public.wishlist_items       enable row level security;
alter table public.support_tickets      enable row level security;
alter table public.site_settings        enable row level security;
```

A helper keeps the admin checks readable and avoids recursive policy lookups:

```sql
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;
```

## profiles

A user may read and update only their own row, and may never change their own
`role` (that would be a privilege-escalation path).

```sql
create policy "profiles: read own"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles: update own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Block self-promotion: role changes are rejected unless made by an admin.
create or replace function public.guard_profile_role()
returns trigger language plpgsql security definer as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'role cannot be changed';
  end if;
  return new;
end;
$$;

create trigger guard_profile_role_trg
  before update on public.profiles
  for each row execute function public.guard_profile_role();
```

Rows are created by a trigger on `auth.users`, which is also where the
**Gmail-only registration rule is really enforced** — the check in
`src/services/auth/emailPolicy.ts` is a UX affordance and can be bypassed from a
console, so it must never be the only gate:

```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if split_part(lower(new.email), '@', 2) not in ('gmail.com') then
    raise exception 'Registration is limited to Gmail addresses.';
  end if;

  insert into public.profiles (id, email, display_name, role, preferences, marketing_opt_in)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'customer',
    '{"currency":"USD","preferred_asset":"USDT","order_email_updates":true,"reduced_motion":null}'::jsonb,
    false
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

> Keep the allow-list in one place. If it grows beyond Gmail, update both this
> function and `ALLOWED_EMAIL_DOMAINS` in `src/config/site.ts`.

## categories, products, inventory

Public read for published rows; writes are admin-only.

```sql
create policy "categories: public read"
  on public.categories for select using (true);

create policy "products: public read active"
  on public.products for select
  using (status = 'active' or public.is_admin());

create policy "inventory: public read"
  on public.inventory for select using (true);

create policy "products: admin write"
  on public.products for all
  using (public.is_admin()) with check (public.is_admin());
```

## orders & order_items

The core requirement: **a user must never see another user's orders.**

```sql
create policy "orders: read own"
  on public.orders for select
  using (user_id = auth.uid() or public.is_admin());

-- No direct INSERT policy for users. Orders are created exclusively through
-- create_order(), which sets user_id from auth.uid() and re-prices the lines.
create policy "orders: admin write"
  on public.orders for all
  using (public.is_admin()) with check (public.is_admin());

create policy "order_items: read via parent order"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );
```

```sql
create or replace function public.create_order(items jsonb, contact_email text)
returns public.orders
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_order public.orders;
begin
  if v_user is null then
    raise exception 'authentication required';
  end if;

  insert into public.orders (user_id, reference, subtotal_cents, discount_cents,
                             total_cents, currency, order_status, payment_status, contact_email)
  values (v_user, public.generate_order_reference(), 0, 0, 0, 'USD', 'pending', 'pending', contact_email)
  returning * into v_order;

  -- Prices come from the products table, never from the payload.
  insert into public.order_items (order_id, product_id, product_name, product_slug,
                                  face_value_cents, unit_price_cents, quantity, total_cents)
  select v_order.id, p.id, p.name, p.slug, p.face_value_cents, p.price_cents,
         least((i->>'quantity')::int, 10),
         p.price_cents * least((i->>'quantity')::int, 10)
  from jsonb_array_elements(items) i
  join public.products p on p.id = (i->>'productId')::uuid
  where p.status = 'active';

  update public.orders o
     set subtotal_cents = agg.face_total,
         total_cents    = agg.pay_total,
         discount_cents = greatest(agg.face_total - agg.pay_total, 0)
    from (
      select sum(face_value_cents * quantity) as face_total,
             sum(total_cents)                 as pay_total
      from public.order_items where order_id = v_order.id
    ) agg
   where o.id = v_order.id
  returning * into v_order;

  return v_order;
end;
$$;
```

Cancellation is likewise a function, so the legal state transitions live in the
database rather than in the browser:

```sql
create or replace function public.cancel_order(order_id uuid)
returns public.orders
language plpgsql security definer set search_path = public as $$
declare v_order public.orders;
begin
  update public.orders
     set order_status = 'cancelled', payment_status = 'cancelled', updated_at = now()
   where id = order_id
     and user_id = auth.uid()
     and payment_status = 'pending'
  returning * into v_order;

  if v_order.id is null then
    raise exception 'order cannot be cancelled';
  end if;
  return v_order;
end;
$$;
```

## payments & payment_transactions

Read-only for the owner. **No user-facing INSERT or UPDATE policy exists at
all** — that is what makes "the frontend cannot declare a payment successful" a
structural guarantee rather than a convention.

```sql
create policy "payments: read own"
  on public.payments for select
  using (user_id = auth.uid() or public.is_admin());

create policy "payment_transactions: read via parent payment"
  on public.payment_transactions for select
  using (
    exists (
      select 1 from public.payments p
      where p.id = payment_transactions.payment_id
        and (p.user_id = auth.uid() or public.is_admin())
    )
  );
```

Writes happen in Edge Functions using the service-role key:

- `create-payment-intent` — validates the order belongs to `auth.uid()`, calls
  the provider with a server-side API key, stores the provider-issued deposit
  address and quote, returns the row.
- `payment-webhook` — verifies the provider's signature, appends to
  `payment_transactions`, and only then promotes `payments.status` and
  `orders.payment_status` / `order_status`.

## wishlists & wishlist_items

```sql
create policy "wishlists: own"
  on public.wishlists for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "wishlist_items: via parent wishlist"
  on public.wishlist_items for all
  using (
    exists (select 1 from public.wishlists w
            where w.id = wishlist_items.wishlist_id and w.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.wishlists w
            where w.id = wishlist_items.wishlist_id and w.user_id = auth.uid())
  );
```

## support_tickets

Users read their own tickets and may create tickets; only support/admin can
change status.

```sql
create policy "tickets: read own"
  on public.support_tickets for select
  using (user_id = auth.uid() or public.is_admin());

create policy "tickets: create own"
  on public.support_tickets for insert
  with check (user_id = auth.uid() or user_id is null);

create policy "tickets: staff update"
  on public.support_tickets for update
  using (public.is_admin()) with check (public.is_admin());
```

## site_settings

```sql
create policy "settings: public read"  on public.site_settings for select using (true);
create policy "settings: admin write"  on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());
```

## Wiring the frontend up

1. `npm i @supabase/supabase-js`
2. Fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, set `VITE_DEMO_MODE=false`.
3. Implement `getSupabaseClient()` in `src/lib/supabase.ts` (the file documents
   the exact replacement).
4. Fill in the `Supabase*Service` classes — they already implement the right
   interfaces and are already selected by the factories in
   `services/*/index.ts` when `backendMode === 'supabase'`.
5. Generate types with `supabase gen types typescript` and reconcile them
   against `src/types/database.ts`.

No component imports Supabase directly, so steps 3–4 are the whole integration.
