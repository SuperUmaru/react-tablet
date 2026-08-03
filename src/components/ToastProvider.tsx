import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContext, type ToastInput } from './toastContext';

type Toast = { id: string; message: string; tone: 'success' | 'error' };

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = useCallback((id: string) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const notify = useCallback((toast: ToastInput) => {
    const id = toast.id ?? `${toast.tone}:${toast.message}`;
    setToasts((items) => items.some((item) => item.id === id) ? items : [...items.slice(-2), { ...toast, id }]);
    window.setTimeout(() => dismiss(id), toast.tone === 'error' ? 7000 : 4500);
  }, [dismiss]);
  const value = useMemo(() => ({ notify }), [notify]);
  return <ToastContext.Provider value={value}>{children}<div className="toast-region" aria-live="polite" aria-atomic="false">{toasts.map((toast) => <div className={`app-toast app-toast--${toast.tone}`} role="status" key={toast.id}>{toast.tone === 'success' ? <CheckCircle2 aria-hidden="true" /> : <AlertCircle aria-hidden="true" />}<span>{toast.message}</span><button type="button" onClick={() => dismiss(toast.id)} aria-label={t('toast.close')}><X aria-hidden="true" /></button></div>)}</div></ToastContext.Provider>;
}
