import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { PageHeader } from '../components/PageHeader';
import { practiceRepository } from '../data/mock/mockPracticeRepository';
import { formatMoney, visitTotal } from '../domain/practice';
import { useTranslation } from 'react-i18next';
import { useToast } from '../components/toastContext';
import { telemetry } from '../observability/telemetry';

export function CheckoutPage() {
  const { t } = useTranslation();
  const { notify } = useToast();
  const client = useQueryClient();
  const query = useQuery({ queryKey:['checkout-visits'], queryFn:() => practiceRepository.listCheckoutVisits() });
  const [selected, setSelected] = useState('visit-501');
  const mutation = useMutation({ mutationFn:(id:string) => practiceRepository.payVisit(id), onMutate:() => telemetry.record('checkout.payment.started'), onSuccess:() => { telemetry.record('checkout.payment.succeeded'); notify({ id:'payment-complete', tone:'success', message:t('toast.paymentComplete') }); void client.invalidateQueries({ queryKey:['checkout-visits'] }); }, onError:() => notify({ id:'payment-error', tone:'error', message:t('toast.actionFailed') }) });
  const visits = query.data ?? [];
  const visit = visits.find((item) => item.id === selected) ?? visits[0];
  return <AppShell><PageHeader eyebrow="PAYMENTS & HANDOFF" title="Checkout" description="Close each visit clearly, accurately, and warmly." />
    <div className="checkout-layout"><aside className="checkout-queue"><h2>Ready for checkout</h2>{visits.map((item) => <button key={item.id} onClick={() => setSelected(item.id)} className={selected === item.id ? 'active' : ''}><span className="patient-avatar">{item.patientName.split(' ').map((part) => part[0]).join('')}</span><span><strong>{item.patientName}</strong><small>{item.provider}</small></span><b>{item.status === 'paid' ? <CheckCircle2 /> : formatMoney(visitTotal(item))}</b></button>)}</aside>
      <section className="invoice-card">{visit ? <><div className="invoice-heading"><div><span className="hero-kicker">VISIT SUMMARY</span><h2>{visit.patientName}</h2><p>{visit.provider}</p></div><span className={`payment-status payment-status--${visit.status}`}>{visit.status}</span></div><div className="invoice-items">{visit.items.map((item) => <div key={item.id}><span>{item.name}<small>Qty {item.quantity}</small></span><strong>{formatMoney(item.unitPriceMinor * item.quantity)}</strong></div>)}</div><div className="invoice-totals"><div><span>Discount</span><strong>−{formatMoney(visit.discountMinor)}</strong></div><div><span>Tax</span><strong>{formatMoney(visit.taxMinor)}</strong></div><div className="grand-total"><span>Total due</span><strong>{formatMoney(visitTotal(visit))}</strong></div></div>{visit.status === 'paid' ? <div className="paid-message"><CheckCircle2 />Payment complete. Receipt ready.</div> : <button disabled={mutation.isPending} onClick={() => mutation.mutate(visit.id)} className="button button--pay"><CreditCard />{mutation.isPending ? 'Processing…' : `Pay ${formatMoney(visitTotal(visit))}`}</button>}</> : <div className="empty-state">No visits are ready for checkout.</div>}</section></div>
  </AppShell>;
}
