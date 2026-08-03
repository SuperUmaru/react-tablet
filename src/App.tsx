import { lazy, Suspense, type ReactNode } from 'react';
import { CheckInPage } from './pages/CheckInPage';
import { DashboardPage } from './pages/DashboardPage';
import { SchedulePage } from './pages/SchedulePage';
import { CheckoutPage } from './pages/CheckoutPage';

const PatientsPage = lazy(() => import('./pages/PatientsPage').then((module) => ({ default:module.PatientsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((module) => ({ default:module.SettingsPage })));

export function App() {
  const routes: Record<string, ReactNode> = { '/':<DashboardPage />, '/check-in':<CheckInPage />, '/schedule':<SchedulePage />, '/patients':<PatientsPage />, '/checkout':<CheckoutPage />, '/settings':<SettingsPage /> };
  return <Suspense fallback={<div className="loading" role="status">Loading page…</div>}>{routes[window.location.pathname] ?? <DashboardPage />}</Suspense>;
}
