import { describe, expect, it } from 'vitest';
import { MockAppointmentRepository } from './mockAppointmentRepository';

describe('MockAppointmentRepository', () => {
  it('lists synthetic appointments as isolated copies', async () => {
    const repository = new MockAppointmentRepository(0);
    const first = await repository.listToday();
    first[0]!.patientFirstName = 'Changed';
    expect((await repository.listToday())[0]!.patientFirstName).toBe('Maya');
  });

  it('finds a matching check-in and returns null for a miss', async () => {
    const repository = new MockAppointmentRepository(0);
    await expect(repository.findForCheckIn('0184', '1988-04-12')).resolves.toMatchObject({ id: 'apt-1042' });
    await expect(repository.findForCheckIn('9999', '1988-04-12')).resolves.toBeNull();
  });

  it('marks an appointment arrived', async () => {
    const repository = new MockAppointmentRepository(0);
    await expect(repository.markArrived('apt-1042')).resolves.toMatchObject({ status: 'arrived' });
  });

  it('rejects an unknown appointment update', async () => {
    await expect(new MockAppointmentRepository(0).markArrived('missing')).rejects.toThrow('Appointment not found');
  });
});

