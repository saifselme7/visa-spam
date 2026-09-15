import { useId, useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
}

/** Accessible disclosure list — native buttons, aria-expanded, no ARIA soup. */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const baseId = useId();
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn('divide-y divide-white/7 border-y border-white/7', className)}>
      {items.map((item) => {
        const expanded = open === item.id;
        const panelId = `${baseId}-${item.id}`;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(expanded ? null : item.id);
                }}
                className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-void-50"
              >
                <span className="text-[14.5px] leading-snug font-medium text-void-50">
                  {item.question}
                </span>
                <Plus
                  aria-hidden
                  className={cn(
                    'mt-0.5 size-4 shrink-0 text-void-400 transition-transform duration-300',
                    expanded && 'rotate-45 text-accent-500',
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              hidden={!expanded}
              className="max-w-2xl pb-5 text-[13.5px] leading-relaxed text-void-300"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
