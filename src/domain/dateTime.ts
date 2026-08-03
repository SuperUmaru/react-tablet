export const CLINIC_TIME_ZONE = 'Asia/Bangkok';

export function formatClinicDateTime(
  startsAt: string,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: CLINIC_TIME_ZONE,
  }).format(new Date(startsAt));
}

export function formatClinicHour(startsAt: string, locale = 'en-US'): string {
  return formatClinicDateTime(startsAt, locale, { hour: 'numeric' });
}

export function formatClinicTime(startsAt: string, locale = 'en-US'): string {
  return formatClinicDateTime(startsAt, locale, { hour: 'numeric', minute: '2-digit' });
}
