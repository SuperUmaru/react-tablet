import type { ReactNode } from 'react';
import { CalendarDays, CreditCard, LayoutDashboard, Settings, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useRouterState } from '@tanstack/react-router';
import { Brand } from './Brand';

const items = [
  { path: '/', key: 'overview', icon: LayoutDashboard },
  { path: '/schedule', key: 'schedule', icon: CalendarDays },
  { path: '/patients', key: 'patients', icon: UserRound },
  { path: '/checkout', key: 'checkout', icon: CreditCard },
  { path: '/settings', key: 'settings', icon: Settings }
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const current = useRouterState({ select: (state) => state.location.pathname });
  return <div className="staff-layout">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <aside className="sidebar">
      <Brand />
      <div className="clinic-pill"><span className="clinic-avatar">RC</span><div><strong>{t('clinic')}</strong><small>Bangkok · Main location</small></div></div>
      <nav aria-label="Primary navigation">
        {items.map(({ path, key, icon: Icon }) => <Link key={path} className={`nav-item ${current === path ? 'nav-item--active' : ''}`} to={path}><Icon />{t(`nav.${key}`)}{key === 'checkout' && <span className="nav-count nav-count--alert">2</span>}</Link>)}
      </nav>
      <div className="sidebar-footer"><Link className="profile-button" to="/settings"><span className="profile-avatar">OM</span><span><strong>Olivia Martin</strong><small>{t('staffPortal')}</small></span><Settings size={17} /></Link></div>
    </aside>
    <main className="dashboard" id="main-content" tabIndex={-1}>{children}</main>
  </div>;
}
