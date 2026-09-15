import { Check } from 'lucide-react';
import type { PaymentMethod } from '@/types/domain';
import { cn } from '@/utils/cn';

export interface PaymentMethodCardProps {
  method: PaymentMethod;
  selected: boolean;
  onSelect: (asset: PaymentMethod['asset']) => void;
}

const ASSET_MARK: Record<string, string> = {
  USDT: '₮',
  USDC: '$',
  BTC: '₿',
  ETH: 'Ξ',
};

export function PaymentMethodCard({ method, selected, onSelect }: PaymentMethodCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => {
        onSelect(method.asset);
      }}
      className={cn(
        'flex w-full items-center gap-4 rounded-[12px] border p-4 text-left transition-colors duration-200',
        selected
          ? 'border-accent-500/45 bg-accent-500/[0.07]'
          : 'border-white/8 bg-void-900/50 hover:border-white/16',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] border font-mono text-[17px]',
          selected
            ? 'border-accent-500/35 bg-accent-500/12 text-accent-400'
            : 'border-white/8 bg-void-850 text-void-200',
        )}
      >
        {ASSET_MARK[method.asset] ?? method.asset[0]}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="text-[14px] font-medium text-void-50">{method.asset}</span>
          <span className="truncate text-[12px] text-void-400">{method.name}</span>
        </span>
        <span className="mt-1 block font-mono text-[11px] tracking-[0.08em] text-void-400 uppercase">
          {method.network} · {method.estimatedSettlement}
        </span>
      </span>

      <span
        aria-hidden
        className={cn(
          'inline-flex size-5 shrink-0 items-center justify-center rounded-full border',
          selected ? 'border-accent-500 bg-accent-500 text-void-950' : 'border-white/14',
        )}
      >
        {selected && <Check className="size-3" />}
      </span>
    </button>
  );
}
