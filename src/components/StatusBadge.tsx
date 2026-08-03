import { useTranslation } from 'react-i18next';
import type { AppointmentStatus } from '../domain/appointment';

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { t } = useTranslation();
  return <span className={`status status--${status}`}>{t(`status.${status}`)}</span>;
}
