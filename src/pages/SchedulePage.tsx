import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarPlus, ChevronDown, Search } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { appointmentRepository } from '../data/mock/mockAppointmentRepository';
import { displayName, initials } from '../domain/appointment';
import { formatClinicHour, formatClinicTime } from '../domain/dateTime';

export function SchedulePage() {
  const query = useQuery({ queryKey: ['appointments', 'today'], queryFn: () => appointmentRepository.listToday() });
  const [search, setSearch] = useState('');
  const [provider, setProvider] = useState('all');
  const filtered = useMemo(() => (query.data ?? []).filter((item) => (provider === 'all' || item.provider === provider) && `${displayName(item)} ${item.service}`.toLowerCase().includes(search.toLowerCase())), [query.data, provider, search]);
  const groups = useMemo(() => Object.entries(filtered.reduce<Record<string, typeof filtered>>((result, appointment) => {
    const label = formatClinicHour(appointment.startsAt);
    (result[label] ??= []).push(appointment);
    return result;
  }, {})), [filtered]);

  return <AppShell><PageHeader eyebrow="CLINIC OPERATIONS" title="Schedule" description="Coordinate providers, arrivals, and patient readiness." actions={<button className="button button--primary"><CalendarPlus />New appointment</button>} />
    <div className="toolbar"><label className="search-field"><Search /><span className="sr-only">Search schedule</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search patient or service" /></label><label className="select-wrap"><span className="sr-only">Filter provider</span><select value={provider} onChange={(event) => setProvider(event.target.value)}><option value="all">All providers</option><option>Dr. Elena Rossi</option><option>Nina Patel, RN</option></select><ChevronDown aria-hidden="true" /></label></div>
    <section className="schedule-board">{groups.map(([hour, appointments]) => <div className="schedule-hour" key={hour}><div className="schedule-hour__label"><time>{hour}</time><span /><small>{appointments.length} appointment{appointments.length === 1 ? '' : 's'}</small></div><div className="appointment-stack">{appointments.map((appointment) => <article className="appointment-card" key={appointment.id}><time>{formatClinicTime(appointment.startsAt)}</time><span className="patient-avatar">{initials(appointment)}</span><div><h3>{displayName(appointment)}</h3><p>{appointment.service} · {appointment.durationMinutes} min</p><small>{appointment.provider}</small></div><StatusBadge status={appointment.status} /><button className="button button--small">Open</button></article>)}</div></div>)}{!query.isLoading && filtered.length === 0 && <div className="empty-state">No appointments match these filters.</div>}</section>
  </AppShell>;
}
