import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '../i18n';
import { renderApp } from '../test/render';
import { CheckInPage } from './CheckInPage';

describe('CheckInPage', () => {
  beforeEach(() => i18n.changeLanguage('en'));

  it('shows a recoverable no-match error', async () => {
    const user = userEvent.setup();
    renderApp(<CheckInPage />);
    await user.type(screen.getByLabelText(/last 4 digits/i), '9999');
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '2000-01-01' } });
    await user.click(screen.getByRole('button', { name: /find my appointment/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent("couldn’t find");
  });

  it('completes check-in and clears the patient session', async () => {
    const user = userEvent.setup();
    renderApp(<CheckInPage />);
    await user.type(screen.getByLabelText(/last 4 digits/i), '0184');
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1988-04-12' } });
    await user.click(screen.getByRole('button', { name: /find my appointment/i }));
    expect(await screen.findByText(/is this your visit/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /yes, check me in/i }));
    expect(await screen.findByText(/you’re checked in/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Finish' }));
    expect(screen.getByRole('heading', { name: 'Welcome to Aurelia' })).toBeInTheDocument();
    expect(screen.getByLabelText(/last 4 digits/i)).toHaveValue('');
  });

  it('can reject a matched identity and return to lookup', async () => {
    const user = userEvent.setup();
    renderApp(<CheckInPage />);
    await user.type(screen.getByLabelText(/last 4 digits/i), '0184');
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1988-04-12' } });
    await user.click(screen.getByRole('button', { name: /find my appointment/i }));
    await user.click(await screen.findByRole('button', { name: /that’s not me/i }));
    expect(screen.getByRole('heading', { name: 'Welcome to Aurelia' })).toBeInTheDocument();
  });
});

