import type { Appointment, AppointmentRepository } from '../../domain/appointment';
import fixture from './appointments.json';

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export class MockAppointmentRepository implements AppointmentRepository {
  private appointments: Appointment[] = structuredClone(fixture) as Appointment[];

  constructor(private readonly latency = 160) {}

  async listToday(): Promise<Appointment[]> {
    await wait(this.latency);
    return structuredClone(this.appointments);
  }

  async findForCheckIn(phoneLastFour: string, dateOfBirth: string): Promise<Appointment | null> {
    await wait(this.latency);
    const result = this.appointments.find(
      (appointment) =>
        appointment.phoneLastFour === phoneLastFour && appointment.dateOfBirth === dateOfBirth,
    );
    return result ? structuredClone(result) : null;
  }

  async markArrived(id: string): Promise<Appointment> {
    await wait(this.latency);
    const appointment = this.appointments.find((item) => item.id === id);
    if (!appointment) throw new Error('Appointment not found');
    appointment.status = 'arrived';
    return structuredClone(appointment);
  }
}

export const appointmentRepository = new MockAppointmentRepository();

