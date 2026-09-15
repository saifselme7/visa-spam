import type { Product } from '@/types/domain';
import { cn } from '@/utils/cn';
import { ProductCard } from './ProductCard';

export interface ProductGridProps {
  products: Product[];
  dense?: boolean;
  className?: string;
  columnsClassName?: string;
}

export function ProductGrid({ products, dense, className, columnsClassName }: ProductGridProps) {
  return (
    <ul
      className={cn(
        'grid list-none gap-5 p-0',
        columnsClassName ?? 'sm:grid-cols-2 xl:grid-cols-3',
        className,
      )}
    >
      {products.map((product) => (
        <li key={product.id} className="flex">
          <ProductCard product={product} dense={dense} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
