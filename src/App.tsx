import { CheckInPage } from './pages/CheckInPage';
import { DashboardPage } from './pages/DashboardPage';
import { SchedulePage } from './pages/SchedulePage';
import { PatientsPage } from './pages/PatientsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const routes: Record<string, ReactNode> = { '/':<DashboardPage />, '/check-in':<CheckInPage />, '/schedule':<SchedulePage />, '/patients':<PatientsPage />, '/checkout':<CheckoutPage />, '/settings':<SettingsPage /> };
  return routes[window.location.pathname] ?? <DashboardPage />;
}
import type { ReactNode } from 'react';
