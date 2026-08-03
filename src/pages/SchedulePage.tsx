import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarPlus, Search } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { appointmentRepository } from '../data/mock/mockAppointmentRepository';
import { displayName, initials } from '../domain/appointment';

export function SchedulePage() {
  const query = useQuery({ queryKey: ['appointments', 'today'], queryFn: () => appointmentRepository.listToday() });
  const [search, setSearch] = useState('');
  const [provider, setProvider] = useState('all');
  const filtered = useMemo(() => (query.data ?? []).filter((item) => (provider === 'all' || item.provider === provider) && `${displayName(item)} ${item.service}`.toLowerCase().includes(search.toLowerCase())), [query.data, provider, search]);

  return <AppShell><PageHeader eyebrow="CLINIC OPERATIONS" title="Schedule" description="Coordinate providers, arrivals, and patient readiness." actions={<button className="button button--primary"><CalendarPlus />New appointment</button>} />
    <div className="toolbar"><label className="search-field"><Search /><span className="sr-only">Search schedule</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search patient or service" /></label><label><span className="sr-only">Filter provider</span><select value={provider} onChange={(event) => setProvider(event.target.value)}><option value="all">All providers</option><option>Dr. Elena Rossi</option><option>Nina Patel, RN</option></select></label></div>
    <section className="schedule-board"><div className="time-rail"><span>9 AM</span><span>10 AM</span><span>11 AM</span><span>12 PM</span><span>1 PM</span><span>2 PM</span></div><div className="appointment-stack">{filtered.map((appointment) => <article className="appointment-card" key={appointment.id}><time>{new Intl.DateTimeFormat('en-US', { hour:'numeric', minute:'2-digit' }).format(new Date(appointment.startsAt))}</time><span className="patient-avatar">{initials(appointment)}</span><div><h3>{displayName(appointment)}</h3><p>{appointment.service} · {appointment.durationMinutes} min</p><small>{appointment.provider}</small></div><StatusBadge status={appointment.status} /><button className="button button--small">Open</button></article>)}{!query.isLoading && filtered.length === 0 && <div className="empty-state">No appointments match these filters.</div>}</div></section>
  </AppShell>;
}

