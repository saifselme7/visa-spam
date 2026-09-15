import { Skeleton } from '@/components/ui/Skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="rounded-[14px] border border-white/7 bg-void-900/60 p-5">
      <Skeleton className="aspect-[1.586/1] w-full rounded-[16px]" />
      <div className="mt-5 space-y-3 border-t border-white/7 pt-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-6 w-28" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
