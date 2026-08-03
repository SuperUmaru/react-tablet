export type AppointmentStatus =
  | 'scheduled'
  | 'arrived'
  | 'forms-incomplete'
  | 'ready'
  | 'in-treatment'
  | 'checkout'
  | 'completed';

export interface Appointment {
  id: string;
  patientFirstName: string;
  patientLastName: string;
  phoneLastFour: string;
  dateOfBirth: string;
  startsAt: string;
  durationMinutes: number;
  service: string;
  provider: string;
  status: AppointmentStatus;
  formsComplete: boolean;
}

export interface AppointmentRepository {
  listToday(): Promise<Appointment[]>;
  findForCheckIn(phoneLastFour: string, dateOfBirth: string): Promise<Appointment | null>;
  markArrived(id: string): Promise<Appointment>;
}

export function initials(appointment: Appointment): string {
  return `${appointment.patientFirstName[0] ?? ''}${appointment.patientLastName[0] ?? ''}`;
}

export function displayName(appointment: Appointment): string {
  return `${appointment.patientFirstName} ${appointment.patientLastName}`;
}

