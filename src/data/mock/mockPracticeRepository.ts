import type { CheckoutVisit, ClinicSettings, Patient, PatientPageRequest, PracticeRepository } from '../../domain/practice';
import checkoutFixture from './checkout.json';
import patientsFixture from './patients.json';
import settingsFixture from './settings.json';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const wait = () => new Promise((resolve) => setTimeout(resolve, 120));
const firstNames = ['Maya', 'Sofia', 'Emma', 'Ava', 'Nora', 'Lina', 'Amara', 'Chloe', 'Isla', 'Mila'];
const lastNames = ['Thompson', 'Martinez', 'Wilson', 'Chen', 'Bennett', 'Patel', 'Garcia', 'Nguyen', 'Kim', 'Brown'];

function buildPatients(seed: Patient[], count = 10_000): Patient[] {
  return Array.from({ length: count }, (_, index) => {
    if (index < seed.length) return seed[index]!;
    const firstName = firstNames[index % firstNames.length]!;
    const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length]!;
    return {
      id: `patient-${String(index + 1).padStart(5, '0')}`,
      firstName,
      lastName,
      email: `${firstName}.${lastName}.${index + 1}@example.test`.toLowerCase(),
      phone: `••• ••• ${String(1000 + (index % 9000))}`,
      lastVisit: `2026-${String(1 + (index % 7)).padStart(2, '0')}-${String(1 + (index % 27)).padStart(2, '0')}`,
      nextVisit: index % 4 === 0 ? null : `2026-08-${String(1 + (index % 27)).padStart(2, '0')}`,
      membership: index % 3 === 0 ? 'Radiance' : index % 5 === 0 ? 'Essential' : null,
      balanceMinor: index % 6 === 0 ? (index % 5 + 1) * 2500 : 0,
      tags: index % 4 === 0 ? ['Skincare'] : index % 4 === 1 ? ['New patient'] : ['Injectables'],
    };
  });
}

export class MockPracticeRepository implements PracticeRepository {
  private patients = buildPatients(clone(patientsFixture) as Patient[]);
  private visits = clone(checkoutFixture) as CheckoutVisit[];
  private settings = clone(settingsFixture) as ClinicSettings;

  async listPatients() { await wait(); return clone(this.patients); }
  async getPatient(id: string) { await wait(); return clone(this.patients.find((patient) => patient.id === id) ?? null); }
  async listPatientsPage({ page, pageSize, search = '', membership = 'all', balance = 'all', visit = 'all', sort = 'default' }: PatientPageRequest) {
    await wait();
    const normalized = search.trim().toLocaleLowerCase();
    const matches = this.patients.filter((patient) => {
      const searchable = `${patient.firstName} ${patient.lastName} ${patient.email} ${patient.phone}`.toLocaleLowerCase();
      const membershipMatch = membership === 'all' || (membership === 'none' ? patient.membership === null : patient.membership === membership);
      const balanceMatch = balance === 'all' || (balance === 'due' ? patient.balanceMinor > 0 : patient.balanceMinor === 0);
      const visitMatch = visit === 'all' || (visit === 'booked' ? patient.nextVisit !== null : patient.nextVisit === null);
      return (!normalized || searchable.includes(normalized)) && membershipMatch && balanceMatch && visitMatch;
    });
    if (sort === 'name') matches.sort((a,b) => `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`));
    if (sort === 'recent-visit') matches.sort((a,b) => b.lastVisit.localeCompare(a.lastVisit));
    if (sort === 'balance') matches.sort((a,b) => b.balanceMinor - a.balanceMinor);
    const start = page * pageSize;
    return clone({
      items: matches.slice(start, start + pageSize),
      page,
      pageSize,
      total: matches.length,
      hasMore: start + pageSize < matches.length,
    });
  }
  async listCheckoutVisits() { await wait(); return clone(this.visits); }
  async payVisit(id: string) {
    await wait();
    const visit = this.visits.find((item) => item.id === id);
    if (!visit) throw new Error('Visit not found');
    visit.status = 'paid';
    return clone(visit);
  }
  async getSettings() { await wait(); return clone(this.settings); }
  async saveSettings(settings: ClinicSettings) { await wait(); this.settings = clone(settings); return clone(this.settings); }
}

export const practiceRepository = new MockPracticeRepository();
