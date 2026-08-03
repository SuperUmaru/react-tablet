import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../test/render';
import { SchedulePage } from './SchedulePage';
import { PatientsPage } from './PatientsPage';
import { CheckoutPage } from './CheckoutPage';
import { SettingsPage } from './SettingsPage';

describe('staff pages', () => {
  it('filters schedule by patient', async () => {
    renderApp(<SchedulePage />, '/schedule');
    expect(await screen.findByText('Maya Thompson')).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText('Search patient or service'), 'Sofia');
    expect(screen.queryByText('Maya Thompson')).not.toBeInTheDocument();
    expect(screen.getByText('Sofia Martinez')).toBeInTheDocument();
  });
  it('searches patients', async () => {
    renderApp(<PatientsPage />, '/patients');
    expect(await screen.findByText('Maya Thompson')).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText('Search name or email'), 'Nora');
    expect(screen.getByText('Nora Bennett')).toBeInTheDocument();
    expect(screen.queryByText('Maya Thompson')).not.toBeInTheDocument();
  });
  it('completes a mock checkout', async () => {
    renderApp(<CheckoutPage />, '/checkout');
    const pay = await screen.findByRole('button', { name:/Pay \$444.00/i });
    await userEvent.click(pay);
    expect(await screen.findByText(/Payment complete/i)).toBeInTheDocument();
  });
  it('edits and saves clinic settings', async () => {
    renderApp(<SettingsPage />, '/settings');
    const clinic = await screen.findByLabelText('Clinic name');
    fireEvent.change(clinic, { target:{ value:'Aurelia Test Clinic' } });
    await userEvent.click(screen.getByRole('button', { name:'Save settings' }));
    expect(await screen.findByText('Settings saved')).toBeInTheDocument();
  });
});
