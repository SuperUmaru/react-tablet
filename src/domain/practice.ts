export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lastVisit: string;
  nextVisit: string | null;
  membership: string | null;
  balanceMinor: number;
  tags: string[];
}

export interface PatientPage {
  items: Patient[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface PatientPageRequest { page: number; pageSize: number; search?: string; }

export interface CheckoutItem { id: string; name: string; quantity: number; unitPriceMinor: number; }
export interface CheckoutVisit {
  id: string;
  patientName: string;
  provider: string;
  items: CheckoutItem[];
  discountMinor: number;
  taxMinor: number;
  status: 'ready' | 'paid';
}

export interface ClinicSettings {
  clinicName: string;
  locationName: string;
  timezone: string;
  currency: string;
  language: string;
  kioskTimeoutMinutes: number;
  requireConsent: boolean;
  allowTips: boolean;
  appointmentReminders: boolean;
}

export interface PracticeRepository {
  listPatients(): Promise<Patient[]>;
  listPatientsPage(request: PatientPageRequest): Promise<PatientPage>;
  listCheckoutVisits(): Promise<CheckoutVisit[]>;
  payVisit(id: string): Promise<CheckoutVisit>;
  getSettings(): Promise<ClinicSettings>;
  saveSettings(settings: ClinicSettings): Promise<ClinicSettings>;
}

export const formatMoney = (minor: number, currency = 'USD', locale = 'en-US') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(minor / 100);

export const visitTotal = (visit: CheckoutVisit) =>
  visit.items.reduce((sum, item) => sum + item.quantity * item.unitPriceMinor, 0) - visit.discountMinor + visit.taxMinor;
