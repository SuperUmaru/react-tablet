import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { renderApp } from './test/render';

describe('App routing', () => {
  it('renders check-in route', () => {
    renderApp(<App />, '/check-in');
    expect(screen.getByRole('heading', { name: /welcome to aurelia/i })).toBeInTheDocument();
  });

  it('uses the dashboard as the safe fallback for unknown routes', async () => {
    renderApp(<App />, '/missing');
    expect(await screen.findByText(/Good morning, Olivia/i)).toBeInTheDocument();
  });
});
