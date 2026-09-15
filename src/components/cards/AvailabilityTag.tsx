import { Badge, type BadgeTone } from '@/components/ui/Badge';
import type { AvailabilityState } from '@/types/domain';

const LABELS: Record<AvailabilityState, { text: string; tone: BadgeTone }> = {
  in_stock: { text: 'In stock', tone: 'accent' },
  low_stock: { text: 'Low stock', tone: 'amber' },
  preorder: { text: 'Pre-order', tone: 'blue' },
  sold_out: { text: 'Sold out', tone: 'red' },
};

export function AvailabilityTag({
  state,
  className,
}: {
  state: AvailabilityState;
  className?: string;
}) {
  const { text, tone } = LABELS[state];
  return (
    <Badge tone={tone} mono className={className}>
      {text}
    </Badge>
  );
}

export const availabilityLabel = (state: AvailabilityState): string => LABELS[state].text;

export const isPurchasable = (state: AvailabilityState): boolean => state !== 'sold_out';
