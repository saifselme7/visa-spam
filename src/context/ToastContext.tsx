import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from 'react';

export type ToastTone = 'default' | 'success' | 'error';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

export interface ToastContextValue {
  toasts: Toast[];
  notify: (toast: Omit<Toast, 'id' | 'tone'> & { tone?: ToastTone }) => void;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_TTL_MS = 4200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const notify = useCallback<ToastContextValue['notify']>(
    ({ title, description, tone = 'default' }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((current) => [...current.slice(-2), { id, title, description, tone }]);
      const timer = window.setTimeout(() => {
        dismiss(id);
      }, TOAST_TTL_MS);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, notify, dismiss }),
    [toasts, notify, dismiss],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
