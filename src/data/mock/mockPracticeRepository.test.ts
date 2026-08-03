import { describe, expect, it } from 'vitest';
import { MockPracticeRepository } from './mockPracticeRepository';

describe('MockPracticeRepository', () => {
  it('returns patient and checkout fixtures', async () => {
    const repository = new MockPracticeRepository();
    expect(await repository.listPatients()).toHaveLength(5);
    expect(await repository.listCheckoutVisits()).toHaveLength(2);
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

