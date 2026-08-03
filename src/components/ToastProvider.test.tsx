import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import '../i18n';
import { ToastProvider } from './ToastProvider';
import { useToast } from './toastContext';

function Harness() { const { notify } = useToast(); return <button onClick={() => { notify({ id:'saved', tone:'success', message:'Settings saved' }); notify({ id:'saved', tone:'success', message:'Settings saved' }); }}>Save</button>; }
describe('ToastProvider', () => {
  it('announces and deduplicates completed actions', async () => {
    render(<ToastProvider><Harness /></ToastProvider>);
    await userEvent.click(screen.getByRole('button', { name:'Save' }));
    expect(screen.getAllByText('Settings saved')).toHaveLength(1);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
