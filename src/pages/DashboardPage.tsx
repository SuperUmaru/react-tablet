import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CalendarCheck, Clock3, CreditCard, HeartPulse, Sparkles, TriangleAlert, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '../components/AppShell';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { appointmentRepository } from '../data/mock/mockAppointmentRepository';
import { displayName, initials } from '../domain/appointment';

export function DashboardPage() {
  const { i18n } = useTranslation();
  const query = useQuery({ queryKey: ['appointments', 'today'], queryFn: () => appointmentRepository.listToday() });
  const items = query.data ?? [];
  const arrived = items.filter((item) => item.status === 'arrived').length;
  const incomplete = items.filter((item) => !item.formsComplete).length;
  const checkout = items.filter((item) => item.status === 'checkout').length;

  return <AppShell>
    <PageHeader eyebrow="MONDAY · AUGUST 3" title="The clinic, at a glance" description="A calm command center for today’s patient journey." actions={<a className="button button--primary" href="/check-in">Start patient check-in<ArrowRight /></a>} />

    <section className="hero-grid">
      <article className="flow-hero">
        <div className="flow-hero__top"><span className="pulse-dot" /><span>Clinic flow is healthy</span><small>Updated just now</small></div>
        <div className="flow-hero__body"><div><span className="hero-kicker">TODAY’S RHYTHM</span><strong>{items.length}</strong><p>appointments moving through Riverside</p></div><div className="flow-orbit" aria-hidden="true"><span><HeartPulse /></span><i /><b /></div></div>
        <div className="journey-strip"><div><span>Arriving</span><strong>{items.length - arrived}</strong></div><i /><div><span>Checked in</span><strong>{arrived}</strong></div><i /><div><span>In care</span><strong>1</strong></div><i /><div><span>Checkout</span><strong>{checkout}</strong></div></div>
      </article>

      <article className="attention-card"><div className="attention-icon"><TriangleAlert /></div><div><span className="hero-kicker">NEEDS YOUR EYE</span><h2>{incomplete} patient{incomplete === 1 ? '' : 's'} need attention</h2><p>Forms or arrival details are incomplete before treatment.</p></div><a href="/schedule">Review schedule<ArrowRight /></a></article>
    </section>

    <section className="signal-grid" aria-label="Daily signals">
      <a href="/schedule" className="signal-card"><span className="signal-icon signal-icon--sage"><CalendarCheck /></span><div><small>SCHEDULED</small><strong>{items.length}</strong><p>First visit at 9:00 AM</p></div></a>
      <a href="/patients" className="signal-card"><span className="signal-icon signal-icon--blue"><Users /></span><div><small>PATIENTS HERE</small><strong>{arrived}</strong><p>Average wait: 6 minutes</p></div></a>
      <a href="/checkout" className="signal-card"><span className="signal-icon signal-icon--rose"><CreditCard /></span><div><small>OPEN CHECKOUTS</small><strong>{checkout + 1}</strong><p>$560.00 awaiting payment</p></div></a>
    </section>

    <div className="overview-columns">
      <section className="schedule-card overview-schedule">
        <div className="section-heading"><div><span className="hero-kicker">NEXT UP</span><h2>The next three visits</h2></div><a className="text-button" href="/schedule">Full schedule<ArrowRight /></a></div>
        <div className="timeline-list">
          {items.slice(0, 3).map((appointment, index) => <article key={appointment.id} className="timeline-item"><div className="timeline-time"><strong>{new Intl.DateTimeFormat(i18n.language, { hour: 'numeric', minute: '2-digit' }).format(new Date(appointment.startsAt))}</strong><span>{appointment.durationMinutes} min</span></div><div className="timeline-line"><i className={index === 0 ? 'active' : ''} /></div><span className="patient-avatar">{initials(appointment)}</span><div className="timeline-info"><strong>{displayName(appointment)}</strong><span>{appointment.service} · {appointment.provider}</span></div><StatusBadge status={appointment.status} /></article>)}
        </div>
      </section>

      <aside className="day-card"><div><Sparkles /><span className="hero-kicker">DAY NOTE</span></div><blockquote>“Two first-time guests today. Give them a little extra orientation.”</blockquote><span>Olivia · Front desk lead</span><hr /><div className="mini-metric"><Clock3 /><span><strong>2:15 PM</strong><small>Expected finish</small></span></div><div className="mini-metric"><HeartPulse /><span><strong>92%</strong><small>Forms ready</small></span></div></aside>
    </div>
  </AppShell>;
}

