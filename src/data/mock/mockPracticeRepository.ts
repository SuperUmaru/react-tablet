import type { CheckoutVisit, ClinicSettings, Patient, PracticeRepository } from '../../domain/practice';
import checkoutFixture from './checkout.json';
import patientsFixture from './patients.json';
import settingsFixture from './settings.json';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const wait = () => new Promise((resolve) => setTimeout(resolve, 120));

export class MockPracticeRepository implements PracticeRepository {
  private patients = clone(patientsFixture) as Patient[];
  private visits = clone(checkoutFixture) as CheckoutVisit[];
  private settings = clone(settingsFixture) as ClinicSettings;

  async listPatients() { await wait(); return clone(this.patients); }
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

