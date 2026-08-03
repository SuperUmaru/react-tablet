import type { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import '../i18n';
import { ToastProvider } from '../components/ToastProvider';

export function renderApp(element: ReactElement, route?: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  const rootRoute = createRootRoute({ component: () => element });
  const router = createRouter({ routeTree: rootRoute, history: createMemoryHistory({ initialEntries: [route ?? '/'] }) });
  return render(<ToastProvider><QueryClientProvider client={queryClient}><RouterProvider router={router} /></QueryClientProvider></ToastProvider>);
}
