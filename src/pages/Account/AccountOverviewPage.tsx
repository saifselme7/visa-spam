import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Package, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { useSeo } from '@/hooks/useSeo';
import { useWishlist } from '@/hooks/useWishlist';
import { orderService } from '@/services/orders';
import { formatMoney } from '@/utils/format';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { OrderCard } from '@/components/account/OrderCard';

export default function AccountOverviewPage() {
  useSeo({
    title: 'Account',
    description: 'Your VOIDCARD account overview.',
    path: ROUTES.account,
    noIndex: true,
  });

  const { user } = useAuth();
  const { entries } = useWishlist();
  const orders = useAsync(() => orderService().listOrders(), []);

  const recent = orders.data?.slice(0, 2) ?? [];
  const openOrders =
    orders.data?.filter(
      (order) => order.orderStatus !== 'completed' && order.orderStatus !== 'cancelled',
    ).length ?? 0;

  return (
    <div className="space-y-10">
      <section aria-label="Summary">
        <ul className="grid list-none gap-4 p-0 sm:grid-cols-3">
          <li className="rounded-[13px] border border-white/7 bg-void-900/50 p-5">
            <Package aria-hidden className="size-4 text-void-400" />
            <p className="mt-4 text-2xl font-medium tabular">{orders.data?.length ?? '—'}</p>
            <p className="mono-label mt-1">Orders placed</p>
          </li>
          <li className="rounded-[13px] border border-white/7 bg-void-900/50 p-5">
            <ShieldCheck aria-hidden className="size-4 text-void-400" />
            <p className="mt-4 text-2xl font-medium tabular">{openOrders}</p>
            <p className="mono-label mt-1">In progress</p>
          </li>
          <li className="rounded-[13px] border border-white/7 bg-void-900/50 p-5">
            <Heart aria-hidden className="size-4 text-void-400" />
            <p className="mt-4 text-2xl font-medium tabular">{entries.length}</p>
            <p className="mono-label mt-1">Saved cards</p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="recent-orders">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="recent-orders" className="text-lg">
            Recent orders
          </h2>
          <Link
            to={ROUTES.orders}
            className="inline-flex items-center gap-1.5 text-[13px] text-accent-500 hover:text-accent-400"
          >
            All orders
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </div>

        {orders.loading && (
          <div className="space-y-4">
            <Skeleton className="h-40 rounded-[13px]" />
            <Skeleton className="h-40 rounded-[13px]" />
          </div>
        )}
        {orders.error && <ErrorState error={orders.error} onRetry={orders.reload} />}
        {orders.data && recent.length === 0 && (
          <EmptyState
            compact
            icon={<Package />}
            title="No orders yet"
            description="Once you buy a card, it will appear here with its delivery status."
            action={
              <ButtonLink to={ROUTES.catalog} size="sm">
                Explore cards
              </ButtonLink>
            }
          />
        )}
        {recent.length > 0 && (
          <div className="space-y-4">
            {recent.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="preferences-summary">
        <h2 id="preferences-summary" className="text-lg">
          Preferences
        </h2>
        <dl className="mt-5 grid gap-px overflow-hidden rounded-[13px] border border-white/7 bg-white/6 sm:grid-cols-3">
          <div className="bg-void-950 p-5">
            <dt className="mono-label">Currency</dt>
            <dd className="mt-2 text-[14px] text-void-50">
              {user?.preferences.currency} · {formatMoney(0, user?.preferences.currency)} format
            </dd>
          </div>
          <div className="bg-void-950 p-5">
            <dt className="mono-label">Preferred asset</dt>
            <dd className="mt-2 text-[14px] text-void-50">{user?.preferences.preferredAsset}</dd>
          </div>
          <div className="bg-void-950 p-5">
            <dt className="mono-label">Order emails</dt>
            <dd className="mt-2 text-[14px] text-void-50">
              {user?.preferences.orderEmailUpdates ? 'On' : 'Off'}
            </dd>
          </div>
        </dl>
        <Link
          to={ROUTES.profile}
          className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-accent-500 hover:text-accent-400"
        >
          Edit profile and security
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </section>
    </div>
  );
}
