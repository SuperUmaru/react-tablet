import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n';
import './styles/tokens.css';
import './styles.css';
import { App } from './App';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { ObservabilityBootstrap } from './components/ObservabilityBootstrap';
import { ToastProvider } from './components/ToastProvider';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } });

createRoot(document.getElementById('root')!).render(<StrictMode><AppErrorBoundary><ToastProvider><QueryClientProvider client={queryClient}><ObservabilityBootstrap /><App /></QueryClientProvider></ToastProvider></AppErrorBoundary></StrictMode>);
