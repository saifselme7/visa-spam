import { Package } from 'lucide-react';
import { ROUTES } from '@/config/site';
import { useAsync } from '@/hooks/useAsync';
import { useSeo } from '@/hooks/useSeo';
import { orderService } from '@/services/orders';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { OrderCard } from '@/components/account/OrderCard';

export default function OrdersPage() {
  useSeo({
    title: 'Orders',
    description: 'Your VOIDCARD order history and delivery status.',
    path: ROUTES.orders,
    noIndex: true,
  });

  const orders = useAsync(() => orderService().listOrders(), []);

  return (
    <div>
      <h2 className="text-lg">Orders</h2>
      <p className="mt-2 text-[13.5px] text-void-300">
        Every order you’ve placed, newest first. Open one to see its payment progress.
      </p>

      <div className="mt-7 space-y-4">
        {orders.loading &&
          Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-44 rounded-[13px]" />
          ))}

        {orders.error && <ErrorState error={orders.error} onRetry={orders.reload} />}

        {orders.data && orders.data.length === 0 && (
          <EmptyState
            icon={<Package />}
            title="No orders yet"
            description="Your purchases and their delivery status will show up here."
            action={
              <ButtonLink to={ROUTES.catalog} size="sm">
                Explore cards
              </ButtonLink>
            }
          />
        )}

        {orders.data?.map((order) => <OrderCard key={order.id} order={order} />)}
      </div>
    </div>
  );
}
