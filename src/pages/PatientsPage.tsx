import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, LoaderCircle, Search, UserPlus } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { PageHeader } from '../components/PageHeader';
import { practiceRepository } from '../data/mock/mockPracticeRepository';
import { formatMoney, type Patient } from '../domain/practice';

const PAGE_SIZE = 24;
type LoadingMode = 'pages' | 'scroll';

function PatientCards({ patients }: { patients: Patient[] }) {
  return <section className="patient-grid">{patients.map((patient, index) => <article className="patient-profile-card" key={patient.id}><div className="patient-profile-top"><span aria-hidden="true" className={`patient-avatar patient-avatar--large patient-avatar--tone-${index % 4}`}>{patient.firstName.slice(0,1)}{patient.lastName.slice(0,1)}</span><div><h2>{patient.firstName} {patient.lastName}</h2><p>{patient.email}</p><span>{patient.phone}</span></div>{patient.membership && <b>{patient.membership}</b>}</div><div className="tag-row">{patient.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><dl><div><dt>Last visit</dt><dd>{patient.lastVisit}</dd></div><div><dt>Next visit</dt><dd>{patient.nextVisit ?? 'Not booked'}</dd></div><div><dt>Balance</dt><dd className={patient.balanceMinor ? 'balance-due' : ''}>{formatMoney(patient.balanceMinor)}</dd></div></dl><button className="button button--secondary">View patient</button></article>)}</section>;
}

export function PatientsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [mode, setMode] = useState<LoadingMode>('pages');
  const [page, setPage] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => { setDebouncedSearch(search.trim()); setPage(0); }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const pageQuery = useQuery({
    queryKey: ['patients', 'page', page, debouncedSearch],
    queryFn: () => practiceRepository.listPatientsPage({ page, pageSize: PAGE_SIZE, search: debouncedSearch }),
    enabled: mode === 'pages',
    placeholderData: (previous) => previous,
  });
  const scrollQuery = useInfiniteQuery({
    queryKey: ['patients', 'scroll', debouncedSearch],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => practiceRepository.listPatientsPage({ page: pageParam, pageSize: PAGE_SIZE, search: debouncedSearch }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: mode === 'scroll',
  });
  const pagePatients = pageQuery.data?.items ?? [];
  const scrollPatients = scrollQuery.data?.pages.flatMap((result) => result.items) ?? [];
  const patients = mode === 'pages' ? pagePatients : scrollPatients;
  const total = mode === 'pages' ? (pageQuery.data?.total ?? 0) : (scrollQuery.data?.pages[0]?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = scrollQuery;

  useEffect(() => {
    const node = loadMoreRef.current;
    if (mode !== 'scroll' || !node || !hasNextPage || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !isFetchingNextPage) void fetchNextPage();
    }, { rootMargin: '350px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, mode]);

  const isLoading = mode === 'pages' ? pageQuery.isFetching : scrollQuery.isFetching;
  return <AppShell><PageHeader eyebrow="PATIENT RELATIONSHIPS" title="Patients" description="Know every guest’s history, membership, and next step." actions={<button className="button button--primary"><UserPlus />Add patient</button>} />
    <div className="patient-controls"><label className="search-field search-field--wide"><Search /><span className="sr-only">Search patients</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search 10,000 patients by name or email" /></label><div className="loading-mode" aria-label="Patient loading mode"><button type="button" aria-pressed={mode === 'pages'} onClick={() => setMode('pages')}>Pages</button><button type="button" aria-pressed={mode === 'scroll'} onClick={() => setMode('scroll')}>Infinite scroll</button></div><span className="result-count" aria-live="polite">Showing {patients.length.toLocaleString()} of {total.toLocaleString()}</span></div>
    <div aria-busy={isLoading}><PatientCards patients={patients} /></div>
    {!isLoading && patients.length === 0 && <p className="empty-state">No patients match “{debouncedSearch}”.</p>}
    {mode === 'pages' ? <nav className="pagination" aria-label="Patient results pages"><button type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)}><ChevronLeft />Previous</button><span>Page <strong>{page + 1}</strong> of {totalPages.toLocaleString()}</span><button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage((value) => value + 1)}>Next<ChevronRight /></button></nav> : <div className="infinite-loader" ref={loadMoreRef}>{isFetchingNextPage && <><LoaderCircle aria-hidden="true" /> Loading more patients…</>}{hasNextPage && !isFetchingNextPage && <button className="button button--secondary" onClick={() => void fetchNextPage()}>Load more patients</button>}{!hasNextPage && patients.length > 0 && <span>All {total.toLocaleString()} matching patients loaded</span>}</div>}
  </AppShell>;
}
