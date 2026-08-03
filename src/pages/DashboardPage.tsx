import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CalendarDays, ChevronRight, ClipboardList, CreditCard, LayoutDashboard, LogOut, Search, Settings, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Brand } from '../components/Brand';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { StatusBadge } from '../components/StatusBadge';
import { appointmentRepository } from '../data/mock/mockAppointmentRepository';
import { displayName, initials } from '../domain/appointment';

export function DashboardPage() {
  const { t, i18n } = useTranslation();
  const appointments = useQuery({ queryKey: ['appointments', 'today'], queryFn: () => appointmentRepository.listToday() });
  const items = appointments.data ?? [];
  const stats = [
    { label: t('dashboard.appointments'), value: items.length || '—', icon: CalendarDays, tone: 'sage' },
    { label: t('dashboard.checkedIn'), value: items.filter((item) => item.status === 'arrived').length || '—', icon: Users, tone: 'blue' },
    { label: t('dashboard.needsAttention'), value: items.filter((item) => !item.formsComplete).length || '—', icon: ClipboardList, tone: 'amber' },
    { label: t('dashboard.readyCheckout'), value: items.filter((item) => item.status === 'checkout').length || '—', icon: CreditCard, tone: 'rose' }
  ];

  return (
    <div className="staff-layout">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <aside className="sidebar">
        <Brand />
        <div className="clinic-pill"><span className="clinic-avatar">RC</span><div><strong>{t('clinic')}</strong><small>Bangkok · Main location</small></div><ChevronRight size={18} /></div>
        <nav aria-label="Primary navigation">
          <a className="nav-item nav-item--active" href="#overview"><LayoutDashboard />{t('nav.overview')}</a>
          <a className="nav-item" href="#schedule"><CalendarDays />{t('nav.schedule')}<span className="nav-count">4</span></a>
          <a className="nav-item" href="#patients"><Users />{t('nav.patients')}</a>
          <a className="nav-item" href="#checkout"><CreditCard />{t('nav.checkout')}<span className="nav-count nav-count--alert">1</span></a>
        </nav>
        <div className="sidebar-footer">
          <a className="nav-item" href="#settings"><Settings />Settings</a>
          <button className="profile-button"><span className="profile-avatar">OM</span><span><strong>Olivia Martin</strong><small>{t('staffPortal')}</small></span><LogOut size={17} /></button>
        </div>
      </aside>

      <main className="dashboard" id="main-content" tabIndex={-1}>
        <header className="dashboard-header">
          <div><p className="date-label">MONDAY, AUGUST 3</p><h1>{t('dashboard.greeting')}</h1><p>{t('dashboard.subtitle')}</p></div>
          <div className="header-actions"><LanguageSwitcher /><button className="icon-button" aria-label="Search"><Search /></button><a className="button button--primary" href="/check-in">{t('dashboard.startCheckIn')}<ArrowRight /></a></div>
        </header>

        <section className="stat-grid" aria-label="Daily summary">
          {stats.map(({ label, value, icon: Icon, tone }) => <article className="stat-card" key={label}><span className={`stat-icon stat-icon--${tone}`}><Icon /></span><div><strong>{value}</strong><span>{label}</span></div></article>)}
        </section>

        <section className="schedule-card">
          <div className="section-heading"><div><h2>{t('dashboard.today')}</h2><p>4 appointments · 9:00 AM – 2:15 PM</p></div><button className="text-button">{t('dashboard.viewSchedule')}<ArrowRight /></button></div>
          {appointments.isLoading ? <div className="loading" role="status" aria-live="polite">Loading appointments…</div> : (
            <div className="schedule-table" role="table" aria-label={t('dashboard.today')}>
              <div className="schedule-row schedule-row--head" role="row"><span role="columnheader">{t('common.time')}</span><span role="columnheader">{t('common.patient')}</span><span role="columnheader">{t('common.service')}</span><span role="columnheader">{t('common.provider')}</span><span role="columnheader">{t('common.status')}</span><span role="columnheader" aria-label="Actions" /></div>
              {items.map((appointment) => (
                <div className="schedule-row" role="row" key={appointment.id}>
                  <time role="cell">{new Intl.DateTimeFormat(i18n.language, { hour: 'numeric', minute: '2-digit' }).format(new Date(appointment.startsAt))}<small>{appointment.durationMinutes} min</small></time>
                  <span className="patient-cell" role="cell"><span className="patient-avatar">{initials(appointment)}</span><strong>{displayName(appointment)}</strong></span>
                  <span role="cell">{appointment.service}</span><span role="cell">{appointment.provider}</span><span role="cell"><StatusBadge status={appointment.status} /></span><span role="cell"><button className="row-button" aria-label={`Open ${displayName(appointment)}`}><ChevronRight /></button></span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
