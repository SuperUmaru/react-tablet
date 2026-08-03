import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '../i18n';
import { renderApp } from '../test/render';
import { DashboardPage } from './DashboardPage';

describe('DashboardPage', () => {
  beforeEach(() => i18n.changeLanguage('en'));

  it('loads daily operations and links to kiosk check-in', async () => {
    renderApp(<DashboardPage />);
    expect(await screen.findByText('Maya Thompson')).toBeInTheDocument();
    expect(screen.getByText(/HydraFacial Signature/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The clinic, at a glance' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start patient check-in/i })).toHaveAttribute('href', '/check-in');
  });
});
