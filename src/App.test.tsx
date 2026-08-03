import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { renderApp } from './test/render';

describe('App routing', () => {
  it('renders check-in route', async () => {
    renderApp(<App initialPath="/check-in" />);
    expect(await screen.findByRole('heading', { name: /welcome to aurelia/i })).toBeInTheDocument();
  });

  it('renders an explicit not-found page for unknown routes', async () => {
    renderApp(<App initialPath="/missing" />);
    expect(await screen.findByRole('heading', { name:/Page not found/i })).toBeInTheDocument();
  });

  it.each([
    ['/schedule', 'Schedule'], ['/patients', 'Patients'], ['/patients/pat-201', 'Maya Thompson'], ['/checkout', 'Checkout'], ['/settings', 'Settings']
  ])('renders %s route', async (route, heading) => {
    renderApp(<App initialPath={route} />);
    expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
  });
});
