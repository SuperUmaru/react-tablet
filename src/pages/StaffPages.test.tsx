import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../test/render';
import { SchedulePage } from './SchedulePage';
import { CheckoutPage } from './CheckoutPage';
import { SettingsPage } from './SettingsPage';
import { App } from '../App';

describe('staff pages', () => {
  it('filters schedule by patient', async () => {
    renderApp(<SchedulePage />, '/schedule');
    expect(await screen.findByText('Maya Thompson')).toBeInTheDocument();
    const onePmGroup = screen.getByText('1 PM').closest('.schedule-hour');
    expect(onePmGroup).toHaveTextContent('1:30 PM');
    await userEvent.type(screen.getByPlaceholderText('Search patient or service'), 'Sofia');
    expect(screen.queryByText('Maya Thompson')).not.toBeInTheDocument();
    expect(screen.getByText('Sofia Martinez')).toBeInTheDocument();
  });
  it('searches patients', async () => {
    renderApp(<App initialPath="/patients" />);
    expect(await screen.findByText('Maya Thompson')).toBeInTheDocument();
    expect(screen.getByText('Showing 24 of 10,000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name:'Previous' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name:'Next' }));
    await userEvent.click(screen.getByLabelText('Membership filter'));
    await userEvent.click(screen.getByRole('option', { name:'Radiance' }));
    await userEvent.click(screen.getByLabelText('Balance filter'));
    await userEvent.click(screen.getByRole('option', { name:'No balance' }));
    await userEvent.click(screen.getByLabelText('Next visit filter'));
    await userEvent.click(screen.getByRole('option', { name:'Visit booked' }));
    await userEvent.click(screen.getByLabelText('Sort patients'));
    await userEvent.click(screen.getByRole('option', { name:'Sort: Recent visit' }));
    await userEvent.click(screen.getByRole('button', { name:'Reset' }));
    await userEvent.click(screen.getByRole('button', { name:'Infinite scroll' }));
    expect(await screen.findByRole('button', { name:'Load more patients' })).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText('Search name, email, or phone'), 'nora@example.test');
    expect(await screen.findByText('Showing 1 of 1')).toBeInTheDocument();
    expect(await screen.findByText('Nora Bennett')).toBeInTheDocument();
    expect(screen.queryByText('Maya Thompson')).not.toBeInTheDocument();
  });
  it('bounds infinite scroll and remembers only the browsing preference', async () => {
    renderApp(<App initialPath="/patients" />);
    await screen.findByText('Maya Thompson');
    await userEvent.click(screen.getByRole('button', { name:'Infinite scroll' }));
    for (let index = 0; index < 4; index += 1) {
      await userEvent.click(await screen.findByRole('button', { name:'Load more patients' }));
    }
    expect(document.querySelectorAll('.patient-profile-card')).toHaveLength(96);
    expect(window.localStorage).toHaveLength(1);
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
