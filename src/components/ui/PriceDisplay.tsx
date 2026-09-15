import type { CurrencyCode } from '@/types/domain';
import { formatMoney } from '@/utils/format';
import { cn } from '@/utils/cn';

export interface PriceDisplayProps {
  price: number;
  faceValue?: number;
  currency?: CurrencyCode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Hides the struck-through face value even when it is higher. */
  hideOriginal?: boolean;
}

const SIZES = {
  sm: { price: 'text-[15px]', original: 'text-[12px]' },
  md: { price: 'text-xl', original: 'text-[13px]' },
  lg: { price: 'text-3xl sm:text-4xl', original: 'text-sm' },
} as const;

export function PriceDisplay({
  price,
  faceValue,
  currency = 'USD',
  size = 'md',
  className,
  hideOriginal,
}: PriceDisplayProps) {
  const showOriginal = !hideOriginal && faceValue !== undefined && faceValue > price;
  const styles = SIZES[size];

  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span className={cn('font-medium text-void-50 tabular', styles.price)}>
        {formatMoney(price, currency)}
      </span>
      {showOriginal && (
        <span className={cn('text-void-300 line-through tabular', styles.original)}>
          {formatMoney(faceValue, currency)}
        </span>
      )}
    </span>
  );
}
