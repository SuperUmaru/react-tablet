import type { ReactNode } from 'react';
import { CalendarDays, CreditCard, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Brand } from './Brand';

const items = [
  { path: '/', key: 'overview', icon: LayoutDashboard },
  { path: '/schedule', key: 'schedule', icon: CalendarDays },
  { path: '/patients', key: 'patients', icon: Users },
  { path: '/checkout', key: 'checkout', icon: CreditCard },
  { path: '/settings', key: 'settings', icon: Settings }
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const current = window.location.pathname;
  return <div className="staff-layout">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <aside className="sidebar">
      <Brand />
      <div className="clinic-pill"><span className="clinic-avatar">RC</span><div><strong>{t('clinic')}</strong><small>Bangkok · Main location</small></div></div>
      <nav aria-label="Primary navigation">
        {items.map(({ path, key, icon: Icon }) => <a key={path} className={`nav-item ${current === path ? 'nav-item--active' : ''}`} href={path}><Icon />{t(`nav.${key}`)}{key === 'checkout' && <span className="nav-count nav-count--alert">2</span>}</a>)}
      </nav>
      <div className="sidebar-footer"><a className="profile-button" href="/settings"><span className="profile-avatar">OM</span><span><strong>Olivia Martin</strong><small>{t('staffPortal')}</small></span><LogOut size={17} /></a></div>
    </aside>
    <main className="dashboard" id="main-content" tabIndex={-1}>{children}</main>
  </div>;
}

