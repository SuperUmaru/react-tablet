import { CheckInPage } from './pages/CheckInPage';
import { DashboardPage } from './pages/DashboardPage';

export function App() {
  return window.location.pathname === '/check-in' ? <CheckInPage /> : <DashboardPage />;
}
