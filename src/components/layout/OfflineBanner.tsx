import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-80 border-b border-signal-amber/25 bg-signal-amber/[0.08] px-4 py-2 text-center text-[12px] text-signal-amber"
    >
      <WifiOff aria-hidden className="mr-2 inline size-3.5 align-[-2px]" />
      You’re offline. Prices and availability may be out of date.
    </div>
  );
}
