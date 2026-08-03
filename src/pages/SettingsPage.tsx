import { useEffect, useState, type FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, Save } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { PageHeader } from '../components/PageHeader';
import { SelectField } from '../components/ui/SelectField';
import { practiceRepository } from '../data/mock/mockPracticeRepository';
import type { ClinicSettings } from '../domain/practice';

const option = (value: string) => ({ value, label: value });

export function SettingsPage() {
  const query = useQuery({ queryKey:['settings'], queryFn:() => practiceRepository.getSettings() });
  const [form, setForm] = useState<ClinicSettings | null>(null);
  useEffect(() => { if (query.data) setForm(query.data); }, [query.data]);
  const mutation = useMutation({ mutationFn:(settings:ClinicSettings) => practiceRepository.saveSettings(settings) });
  if (!form) return <AppShell><div className="loading" role="status">Loading settings…</div></AppShell>;
  const update = <K extends keyof ClinicSettings>(key:K, value:ClinicSettings[K]) => setForm({ ...form, [key]:value });
  const submit = (event:FormEvent) => { event.preventDefault(); mutation.mutate(form); };

  return <AppShell><PageHeader eyebrow="CLINIC CONFIGURATION" title="Settings" description="Control the patient experience and daily clinic defaults." />
    <form className="settings-form" onSubmit={submit}>
      <section>
        <div className="settings-section-title"><span>01</span><div><h2>Clinic identity</h2><p>Shown to patients and staff.</p></div></div>
        <div className="form-grid">
          <label>Clinic name<input value={form.clinicName} onChange={(event) => update('clinicName',event.target.value)} /></label>
          <label>Location name<input value={form.locationName} onChange={(event) => update('locationName',event.target.value)} /></label>
          <div className="field-label">Timezone<SelectField label="Timezone" value={form.timezone} onValueChange={(value) => update('timezone',value)} options={['Asia/Bangkok','Europe/London','America/New_York'].map(option)} /></div>
          <div className="field-label">Currency<SelectField label="Currency" value={form.currency} onValueChange={(value) => update('currency',value)} options={['USD','EUR','THB'].map(option)} /></div>
        </div>
      </section>
      <section>
        <div className="settings-section-title"><span>02</span><div><h2>Kiosk & communication</h2><p>Privacy, consent, and visit reminders.</p></div></div>
        <div className="setting-list">
          <label><span><strong>Kiosk timeout</strong><small>Clear patient data after inactivity</small></span><SelectField label="Kiosk timeout" value={String(form.kioskTimeoutMinutes)} onValueChange={(value) => update('kioskTimeoutMinutes',Number(value))} options={[3,5,10].map((value) => ({ value:String(value),label:`${value} minutes` }))} /></label>
          {([['requireConsent','Require consent before check-in'],['allowTips','Allow gratuity at checkout'],['appointmentReminders','Send appointment reminders']] as const).map(([key,label]) => <label key={key}><span><strong>{label}</strong><small>Applies at this location</small></span><input type="checkbox" checked={form[key]} onChange={(event) => update(key,event.target.checked)} /></label>)}
        </div>
      </section>
      <div className="settings-actions">{mutation.isSuccess && <span className="save-success"><Check />Settings saved</span>}<button className="button button--primary" disabled={mutation.isPending}><Save />{mutation.isPending ? 'Saving…' : 'Save settings'}</button></div>
    </form>
  </AppShell>;
}
