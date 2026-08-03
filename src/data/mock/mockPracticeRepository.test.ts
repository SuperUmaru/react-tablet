import { describe, expect, it } from 'vitest';
import { MockPracticeRepository } from './mockPracticeRepository';

describe('MockPracticeRepository', () => {
  it('returns patient and checkout fixtures', async () => {
    const repository = new MockPracticeRepository();
    expect(await repository.listPatients()).toHaveLength(10_000);
    expect(await repository.listCheckoutVisits()).toHaveLength(2);
  });
  it('pages and searches the 10k patient JSON contract', async () => {
    const repository = new MockPracticeRepository();
    const first = await repository.listPatientsPage({ page: 0, pageSize: 24 });
    expect(first).toMatchObject({ page: 0, pageSize: 24, total: 10_000, hasMore: true });
    expect(first.items).toHaveLength(24);
    const search = await repository.listPatientsPage({ page: 0, pageSize: 24, search: 'maya@example.test' });
    expect(search.total).toBe(1);
    expect(search.items[0]!.firstName).toBe('Maya');
    const filtered = await repository.listPatientsPage({ page:0,pageSize:24,membership:'Radiance',balance:'due',visit:'booked',sort:'balance' });
    expect(filtered.items.every((patient) => patient.membership === 'Radiance' && patient.balanceMinor > 0 && patient.nextVisit)).toBe(true);
    const unbooked = await repository.listPatientsPage({ page:0,pageSize:24,membership:'none',balance:'clear',visit:'not-booked',sort:'recent-visit' });
    expect(unbooked.items.every((patient) => !patient.membership && patient.balanceMinor === 0 && !patient.nextVisit)).toBe(true);
    await expect(repository.listPatientsPage({ page:0,pageSize:1,sort:'name' })).resolves.toMatchObject({ items:[expect.any(Object)] });
  });
  it('pays a visit and rejects an unknown visit', async () => {
    const repository = new MockPracticeRepository();
    await expect(repository.payVisit('visit-501')).resolves.toMatchObject({ status:'paid' });
    await expect(repository.payVisit('missing')).rejects.toThrow('Visit not found');
  });
  it('loads and saves settings as isolated copies', async () => {
    const repository = new MockPracticeRepository();
    const settings = await repository.getSettings();
    settings.clinicName = 'Updated Clinic';
    await expect(repository.saveSettings(settings)).resolves.toMatchObject({ clinicName:'Updated Clinic' });
  });
});
