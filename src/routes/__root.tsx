import { createRootRoute, Outlet } from '@tanstack/react-router';

function NotFoundPage() {
  return <main className="not-found"><p className="eyebrow">404</p><h1>Page not found</h1><p>The requested clinic page does not exist.</p><a className="button button--primary" href="/">Return to overview</a></main>;
}

export const Route = createRootRoute({
  component:Outlet,
  notFoundComponent:NotFoundPage,
});
