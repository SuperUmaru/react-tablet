import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { CalendarPlus, ChevronLeft, ChevronRight, LoaderCircle, RotateCcw, Search, UserPlus } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { PageHeader } from '../components/PageHeader';
import { SelectField } from '../components/ui/SelectField';
import { practiceRepository } from '../data/mock/mockPracticeRepository';
import { formatMoney, type Patient, type PatientPageRequest } from '../domain/practice';
import { readPatientLoadingMode, savePatientLoadingMode, type PatientLoadingMode } from '../config/storage';

const PAGE_SIZE = 24;
const MAX_SCROLL_PAGES = 4;
type Membership = NonNullable<PatientPageRequest['membership']>;
type Balance = NonNullable<PatientPageRequest['balance']>;
type Visit = NonNullable<PatientPageRequest['visit']>;
type Sort = NonNullable<PatientPageRequest['sort']>;

function PatientCards({ patients }: { patients: Patient[] }) {
  return <section className="patient-grid">{patients.map((patient, index) => <article className="patient-profile-card" style={{ '--card-index':index % PAGE_SIZE } as React.CSSProperties} key={patient.id}><div className="patient-profile-top"><span aria-hidden="true" className={`patient-avatar patient-avatar--large patient-avatar--tone-${index % 4}`}>{patient.firstName.slice(0,1)}{patient.lastName.slice(0,1)}</span><div><h2>{patient.firstName} {patient.lastName}</h2><p>{patient.email}</p><span>{patient.phone}</span></div>{patient.membership && <b>{patient.membership}</b>}</div><div className="tag-row">{patient.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><dl><div><dt>Last visit</dt><dd>{patient.lastVisit}</dd></div><div><dt>Next visit</dt><dd>{patient.nextVisit ?? 'Not booked'}</dd></div><div><dt>Balance</dt><dd className={patient.balanceMinor ? 'balance-due' : ''}>{formatMoney(patient.balanceMinor)}</dd></div></dl><div className="patient-card-actions"><Link className="button button--secondary" to="/patients/$patientId" params={{ patientId:patient.id }}>View patient</Link><Link className="button button--quiet" to="/schedule" search={{ patientId:patient.id }}><CalendarPlus />Schedule</Link></div></article>)}</section>;
}

export function PatientsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [mode, setMode] = useState<PatientLoadingMode>(readPatientLoadingMode);
  const [membership, setMembership] = useState<Membership>('all');
  const [balance, setBalance] = useState<Balance>('all');
  const [visit, setVisit] = useState<Visit>('all');
  const [sort, setSort] = useState<Sort>('default');
  const [page, setPage] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = window.setTimeout(() => { setDebouncedSearch(search.trim()); setPage(0); }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const request = { pageSize:PAGE_SIZE, search:debouncedSearch, membership, balance, visit, sort };
  const filterKey = [debouncedSearch,membership,balance,visit,sort] as const;
  const pageQuery = useQuery({
    queryKey: ['patients','page',page,...filterKey],
    queryFn: () => practiceRepository.listPatientsPage({ ...request,page }),
    enabled: mode === 'pages',
  });
  const scrollQuery = useInfiniteQuery({
    queryKey: ['patients','scroll',...filterKey],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => practiceRepository.listPatientsPage({ ...request,page:pageParam }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (firstPage) => firstPage.page > 0 ? firstPage.page - 1 : undefined,
    maxPages: MAX_SCROLL_PAGES,
    enabled: mode === 'scroll',
  });
  const pagePatients = pageQuery.data?.items ?? [];
  const scrollPatients = scrollQuery.data?.pages.flatMap((result) => result.items) ?? [];
  const patients = mode === 'pages' ? pagePatients : scrollPatients;
  const total = mode === 'pages' ? (pageQuery.data?.total ?? 0) : (scrollQuery.data?.pages[0]?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = scrollQuery;

  useEffect(() => {
    if (mode !== 'pages' || !pageQuery.data) return;
    const adjacentPages = [page - 1, page + 1].filter((candidate) => candidate >= 0 && candidate < totalPages);
    for (const adjacentPage of adjacentPages) {
      void queryClient.prefetchQuery({
        queryKey: ['patients','page',adjacentPage,debouncedSearch,membership,balance,visit,sort],
        queryFn: () => practiceRepository.listPatientsPage({ pageSize:PAGE_SIZE,search:debouncedSearch,membership,balance,visit,sort,page:adjacentPage }),
        staleTime: 60_000,
      });
    }
  }, [debouncedSearch, membership, balance, visit, sort, mode, page, pageQuery.data, queryClient, totalPages]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (mode !== 'scroll' || !node || !hasNextPage || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !isFetchingNextPage) void fetchNextPage();
    }, { rootMargin:'280px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage,hasNextPage,isFetchingNextPage,mode]);

  const resetFilters = () => { setSearch(''); setMembership('all'); setBalance('all'); setVisit('all'); setSort('default'); setPage(0); };
  const changeMode = (value:PatientLoadingMode) => { setMode(value); savePatientLoadingMode(value); setPage(0); window.scrollTo({ top:0,behavior:'smooth' }); };
  const isLoading = mode === 'pages' ? pageQuery.isFetching : scrollQuery.isFetching;

  return <AppShell><PageHeader eyebrow="PATIENT RELATIONSHIPS" title="Patients" description="Search and act on the right patient without leaving the tablet workflow." actions={<button className="button button--primary"><UserPlus />Add patient</button>} />
    <section className="patient-search-panel" aria-label="Patient search and filters">
      <div className="patient-search-row"><label className="search-field search-field--wide"><Search /><span className="sr-only">Search patients</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or phone" /></label><div className="loading-mode" aria-label="Patient loading mode"><button type="button" aria-pressed={mode === 'pages'} onClick={() => changeMode('pages')}>Pages</button><button type="button" aria-pressed={mode === 'scroll'} onClick={() => changeMode('scroll')}>Infinite scroll</button></div><span className="result-count" aria-live="polite">Showing {patients.length.toLocaleString()} of {total.toLocaleString()}</span></div>
      <div className="patient-filter-row">
        <SelectField className="filter-select" label="Membership filter" value={membership} onValueChange={(value) => { setMembership(value as Membership);setPage(0); }} options={[{value:'all',label:'All memberships'},{value:'Radiance',label:'Radiance'},{value:'Essential',label:'Essential'},{value:'none',label:'No membership'}]} />
        <SelectField className="filter-select" label="Balance filter" value={balance} onValueChange={(value) => { setBalance(value as Balance);setPage(0); }} options={[{value:'all',label:'Any balance'},{value:'due',label:'Balance due'},{value:'clear',label:'No balance'}]} />
        <SelectField className="filter-select" label="Next visit filter" value={visit} onValueChange={(value) => { setVisit(value as Visit);setPage(0); }} options={[{value:'all',label:'Any next visit'},{value:'booked',label:'Visit booked'},{value:'not-booked',label:'Not booked'}]} />
        <SelectField className="filter-select" label="Sort patients" value={sort} onValueChange={(value) => { setSort(value as Sort);setPage(0); }} options={[{value:'default',label:'Sort: Clinic order'},{value:'name',label:'Sort: Name'},{value:'recent-visit',label:'Sort: Recent visit'},{value:'balance',label:'Sort: Balance'}]} />
        <button className="reset-filters" type="button" onClick={resetFilters}><RotateCcw />Reset</button>
      </div>
    </section>
    <div aria-busy={isLoading} data-patient-card-limit={PAGE_SIZE * MAX_SCROLL_PAGES}><PatientCards patients={patients} /></div>
    {!isLoading && patients.length === 0 && <p className="empty-state">No patients match these search options.</p>}
    {mode === 'pages' ? <nav className="pagination" aria-label="Patient results pages"><button type="button" disabled={page === 0} onClick={() => { setPage((value) => value - 1);window.scrollTo({top:0,behavior:'smooth'}); }}><ChevronLeft />Previous</button><span>Page <strong>{page + 1}</strong> of {totalPages.toLocaleString()}</span><button type="button" disabled={page + 1 >= totalPages} onClick={() => { setPage((value) => value + 1);window.scrollTo({top:0,behavior:'smooth'}); }}>Next<ChevronRight /></button></nav> : <div className="infinite-loader" ref={loadMoreRef}>{isFetchingNextPage && <><LoaderCircle aria-hidden="true" /> Loading more patients…</>}{hasNextPage && !isFetchingNextPage && <button className="button button--secondary" onClick={() => void fetchNextPage()}>Load more patients</button>}{!hasNextPage && patients.length > 0 && <span>All {total.toLocaleString()} matching patients loaded</span>}</div>}
  </AppShell>;
}
