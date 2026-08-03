import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, UserPlus } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { PageHeader } from '../components/PageHeader';
import { practiceRepository } from '../data/mock/mockPracticeRepository';
import { formatMoney } from '../domain/practice';

export function PatientsPage() {
  const query = useQuery({ queryKey: ['patients'], queryFn: () => practiceRepository.listPatients() });
  const [search, setSearch] = useState('');
  const patients = useMemo(() => (query.data ?? []).filter((item) => `${item.firstName} ${item.lastName} ${item.email}`.toLowerCase().includes(search.toLowerCase())), [query.data, search]);
  return <AppShell><PageHeader eyebrow="PATIENT RELATIONSHIPS" title="Patients" description="Know every guest’s history, membership, and next step." actions={<button className="button button--primary"><UserPlus />Add patient</button>} />
    <div className="toolbar"><label className="search-field search-field--wide"><Search /><span className="sr-only">Search patients</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" /></label><span className="result-count">{patients.length} patients</span></div>
    <section className="patient-grid">{patients.map((patient) => <article className="patient-profile-card" key={patient.id}><div className="patient-profile-top"><span className="patient-avatar patient-avatar--large">{patient.firstName[0]}{patient.lastName[0]}</span><div><h2>{patient.firstName} {patient.lastName}</h2><p>{patient.email}</p><span>{patient.phone}</span></div>{patient.membership && <b>{patient.membership}</b>}</div><div className="tag-row">{patient.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><dl><div><dt>Last visit</dt><dd>{patient.lastVisit}</dd></div><div><dt>Next visit</dt><dd>{patient.nextVisit ?? 'Not booked'}</dd></div><div><dt>Balance</dt><dd className={patient.balanceMinor ? 'balance-due' : ''}>{formatMoney(patient.balanceMinor)}</dd></div></dl><button className="button button--secondary">View patient</button></article>)}</section>
  </AppShell>;
}

