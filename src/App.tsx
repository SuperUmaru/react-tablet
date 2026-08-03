import { useState } from 'react';
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router';
import { createAppRouter } from './router';

export function App({ initialPath }: { initialPath?:string }) {
  const [router] = useState(() => createAppRouter(initialPath ? createMemoryHistory({ initialEntries:[initialPath] }) : undefined));
  return <RouterProvider router={router} defaultPendingComponent={() => <div className="loading" role="status">Loading page…</div>} />;
}
