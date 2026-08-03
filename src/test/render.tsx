import type { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import '../i18n';

export function renderApp(element: ReactElement, route?: string) {
  if (route) window.history.replaceState({}, '', route);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(<QueryClientProvider client={queryClient}>{element}</QueryClientProvider>);
}
