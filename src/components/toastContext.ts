import { createContext, useContext } from 'react';

export type ToastInput = { id?: string; message: string; tone: 'success' | 'error' };
export const ToastContext = createContext<{ notify: (toast: ToastInput) => void }>({ notify: () => undefined });
export const useToast = () => useContext(ToastContext);
