import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { IconButton } from './IconButton';
import { cn } from '@/utils/cn';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: 'right' | 'left';
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  side = 'right',
  children,
  footer,
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const offset = side === 'right' ? '100%' : '-100%';

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100">
          <motion.button
            type="button"
            aria-label="Close panel"
            className="absolute inset-0 bg-void-950/75 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          />
          <motion.aside
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'absolute inset-y-0 flex w-full max-w-[420px] flex-col border-white/8 bg-void-900 outline-none',
              side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
              className,
            )}
            initial={reducedMotion ? { opacity: 0 } : { x: offset }}
            animate={reducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { x: offset }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex items-center justify-between gap-4 border-b border-white/7 px-5 py-4">
              <h2 className="text-base font-medium">{title}</h2>
              <IconButton size="sm" label="Close panel" icon={<X />} onClick={onClose} />
            </header>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">{children}</div>
            {footer && <footer className="border-t border-white/7 px-5 py-4">{footer}</footer>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
