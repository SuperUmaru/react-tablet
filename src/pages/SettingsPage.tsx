import { useEffect, useState, type FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, Save } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { PageHeader } from '../components/PageHeader';
import { practiceRepository } from '../data/mock/mockPracticeRepository';
import type { ClinicSettings } from '../domain/practice';

export function SettingsPage() {
  const query = useQuery({ queryKey:['settings'], queryFn:() => practiceRepository.getSettings() });
  const [form, setForm] = useState<ClinicSettings | null>(null);
  useEffect(() => { if (query.data) setForm(query.data); }, [query.data]);
  const mutation = useMutation({ mutationFn:(settings:ClinicSettings) => practiceRepository.saveSettings(settings) });
  if (!form) return <AppShell><div className="loading" role="status">Loading settings…</div></AppShell>;
  const update = <K extends keyof ClinicSettings>(key:K, value:ClinicSettings[K]) => setForm({ ...form, [key]:value });
  const submit = (event:FormEvent) => { event.preventDefault(); mutation.mutate(form); };
  return <AppShell><PageHeader eyebrow="CLINIC CONFIGURATION" title="Settings" description="Control the patient experience and daily clinic defaults." />
    <form className="settings-form" onSubmit={submit}><section><div className="settings-section-title"><span>01</span><div><h2>Clinic identity</h2><p>Shown to patients and staff.</p></div></div><div className="form-grid"><label>Clinic name<input value={form.clinicName} onChange={(e) => update('clinicName',e.target.value)} /></label><label>Location name<input value={form.locationName} onChange={(e) => update('locationName',e.target.value)} /></label><label>Timezone<select value={form.timezone} onChange={(e) => update('timezone',e.target.value)}><option>Asia/Bangkok</option><option>Europe/London</option><option>America/New_York</option></select></label><label>Currency<select value={form.currency} onChange={(e) => update('currency',e.target.value)}><option>USD</option><option>EUR</option><option>THB</option></select></label></div></section><section><div className="settings-section-title"><span>02</span><div><h2>Kiosk & communication</h2><p>Privacy, consent, and visit reminders.</p></div></div><div className="setting-list"><label><span><strong>Kiosk timeout</strong><small>Clear patient data after inactivity</small></span><select value={form.kioskTimeoutMinutes} onChange={(e) => update('kioskTimeoutMinutes',Number(e.target.value))}><option value="3">3 minutes</option><option value="5">5 minutes</option><option value="10">10 minutes</option></select></label>{([['requireConsent','Require consent before check-in'],['allowTips','Allow gratuity at checkout'],['appointmentReminders','Send appointment reminders']] as const).map(([key,label]) => <label key={key}><span><strong>{label}</strong><small>Applies at this location</small></span><input type="checkbox" checked={form[key]} onChange={(e) => update(key,e.target.checked)} /></label>)}</div></section><div className="settings-actions">{mutation.isSuccess && <span className="save-success"><Check />Settings saved</span>}<button className="button button--primary" disabled={mutation.isPending}><Save />{mutation.isPending ? 'Saving…' : 'Save settings'}</button></div></form>
  </AppShell>;
}
