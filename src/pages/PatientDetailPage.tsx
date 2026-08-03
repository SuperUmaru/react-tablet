import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, CalendarPlus } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { PageHeader } from '../components/PageHeader';
import { practiceRepository } from '../data/mock/mockPracticeRepository';
import { formatMoney } from '../domain/practice';

export function PatientDetailPage({ patientId }: { patientId:string }) {
  const query = useQuery({ queryKey:['patient',patientId], queryFn:() => practiceRepository.getPatient(patientId), enabled:Boolean(patientId) });
  const patient = query.data;
  if (query.isLoading) return <AppShell><p className="loading" role="status">Loading patient…</p></AppShell>;
  if (!patient) return <AppShell><PageHeader eyebrow="PATIENT RELATIONSHIPS" title="Patient not found" description="Return to the directory and choose a patient." actions={<Link className="button button--secondary" to="/patients"><ArrowLeft />Patients</Link>} /></AppShell>;
  const fullName = `${patient.firstName} ${patient.lastName}`;
  return <AppShell><PageHeader eyebrow="PATIENT PROFILE" title={fullName} description="A focused clinical-service summary without exposing data in browser storage." actions={<><Link className="button button--secondary" to="/patients"><ArrowLeft />Patients</Link><Link className="button button--primary" to="/schedule" search={{ patientId:patient.id }}><CalendarPlus />Quick schedule</Link></>} />
    <section className="patient-detail-card"><h2>Contact and visit summary</h2><dl><div><dt>Email</dt><dd>{patient.email}</dd></div><div><dt>Phone</dt><dd>{patient.phone}</dd></div><div><dt>Membership</dt><dd>{patient.membership ?? 'None'}</dd></div><div><dt>Last visit</dt><dd>{patient.lastVisit}</dd></div><div><dt>Next visit</dt><dd>{patient.nextVisit ?? 'Not booked'}</dd></div><div><dt>Balance</dt><dd>{formatMoney(patient.balanceMinor)}</dd></div></dl><Link className="text-button" to="/schedule" search={{ patientId:patient.id }}>View full schedule for {fullName}</Link></section>
  </AppShell>;
}
