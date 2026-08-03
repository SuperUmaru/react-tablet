import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import i18n from '../i18n';
import { Brand } from './Brand';
import { LanguageSwitcher } from './LanguageSwitcher';
import { StatusBadge } from './StatusBadge';
import { renderApp } from '../test/render';

describe('shared components', () => {
  it('renders branding and translated status', async () => {
    await i18n.changeLanguage('en');
    renderApp(<><Brand compact /><StatusBadge status="arrived" /></>);
    expect(screen.getByLabelText('Aurelia')).toBeInTheDocument();
    expect(screen.getByText('Arrived')).toBeInTheDocument();
  });

  it('switches language', async () => {
    await i18n.changeLanguage('en');
    renderApp(<LanguageSwitcher light />);
    fireEvent.change(screen.getByLabelText('Language'), { target: { value: 'es' } });
    expect(await screen.findByLabelText('Idioma')).toHaveValue('es');
  });
});

