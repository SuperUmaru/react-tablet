import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Check, LockKeyhole, Phone, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Brand } from '../components/Brand';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { appointmentRepository } from '../data/mock/mockAppointmentRepository';
import type { Appointment } from '../domain/appointment';
import { formatClinicDateTime } from '../domain/dateTime';

type Step = 'lookup' | 'confirm' | 'success';

export function CheckInPage() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState<Step>('lookup');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function lookup(event: FormEvent) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const match = await appointmentRepository.findForCheckIn(phone, dob);
      if (!match) { setError(t('kiosk.notFound')); return; }
      setAppointment(match); setStep('confirm');
    } catch { setError(t('toast.actionFailed')); }
    finally { setBusy(false); }
  }

  async function confirm() {
    if (!appointment) return;
    setError(''); setBusy(true);
    try {
      const updated = await appointmentRepository.markArrived(appointment.id);
      setAppointment(updated); setStep('success');
    } catch { setError(t('toast.actionFailed')); }
    finally { setBusy(false); }
  }

  function reset() { setPhone(''); setDob(''); setAppointment(null); setError(''); setStep('lookup'); }

  return (
    <div className="kiosk-shell">
      <a className="skip-link" href="#check-in-content">Skip to check-in form</a>
      <header className="kiosk-header"><Brand /><LanguageSwitcher light /><a href="/" className="staff-link"><LockKeyhole size={16} />{t('staffPortal')}</a></header>
      <main className="kiosk-main" id="check-in-content" tabIndex={-1}>
        <div className="kiosk-progress" aria-label="Check-in progress"><span className={step !== 'lookup' ? 'complete' : 'active'}><Check size={15} />1</span><i className={step !== 'lookup' ? 'complete' : ''} /><span className={step === 'confirm' ? 'active' : step === 'success' ? 'complete' : ''}><Check size={15} />2</span><i className={step === 'success' ? 'complete' : ''} /><span className={step === 'success' ? 'active' : ''}><Check size={15} />3</span></div>

        {step === 'lookup' && <section className="kiosk-card">
          <div className="kiosk-icon"><ShieldCheck /></div><p className="eyebrow">{t('kiosk.eyebrow')}</p><h1>{t('kiosk.title')}</h1><p className="kiosk-subtitle">{t('kiosk.subtitle')}</p>
          <form onSubmit={(event) => void lookup(event)}>
            <label>{t('kiosk.phone')}<span className="field-wrap"><Phone /><input inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ''))} placeholder="••••" required autoFocus /></span></label>
            <label>{t('kiosk.dob')}<span className="field-wrap"><Calendar /><input type="date" value={dob} onChange={(event) => setDob(event.target.value)} required /></span></label>
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="button button--kiosk" disabled={busy} aria-busy={busy}>{busy ? 'Finding…' : t('kiosk.continue')}<ArrowRight /></button>
          </form>
          <p className="help-text">{t('kiosk.staffHelp')}</p>
          <p className="demo-hint">Demo: <strong>0184</strong> · <strong>12/04/1988</strong></p>
        </section>}

        {step === 'confirm' && appointment && <section className="kiosk-card confirmation-card">
          <div className="kiosk-icon"><Calendar /></div><p className="eyebrow">{t('kiosk.found')}</p><h1>{appointment.patientFirstName}, is this your visit?</h1>
          <div className="appointment-confirmation"><div><span>Date & time</span><strong>{formatClinicDateTime(appointment.startsAt, i18n.language, { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</strong></div><div><span>Treatment</span><strong>{appointment.service}</strong></div><div><span>Provider</span><strong>{appointment.provider}</strong></div></div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="button button--kiosk" onClick={() => void confirm()} disabled={busy}>{busy ? 'Checking in…' : t('kiosk.confirm')}<ArrowRight /></button>
          <button className="button button--quiet" onClick={() => setStep('lookup')}><ArrowLeft />{t('kiosk.back')}</button>
        </section>}

        {step === 'success' && <section className="kiosk-card success-card">
          <div className="success-mark"><Check /></div><h1>{t('kiosk.success')}</h1><p className="kiosk-subtitle">{t('kiosk.successDetail')}</p><button className="button button--kiosk" onClick={reset}>{t('kiosk.finish')}</button>
        </section>}
      </main>
      <footer className="kiosk-footer"><span><ShieldCheck size={17} />Your information is encrypted and private</span><span>© 2026 Aurelia Clinic</span></footer>
    </div>
  );
}
