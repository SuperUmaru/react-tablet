import { describe, expect, it } from 'vitest';
import { CLINIC_TIME_ZONE, formatClinicDateTime, formatClinicHour, formatClinicTime } from './dateTime';

describe('clinic date and time formatting', () => {
  const appointment = '2026-08-03T13:30:00+07:00';

  it('uses the configured clinic timezone for schedule labels', () => {
    expect(CLINIC_TIME_ZONE).toBe('Asia/Bangkok');
    expect(formatClinicHour(appointment)).toBe('1 PM');
    expect(formatClinicTime(appointment)).toBe('1:30 PM');
  });

  it('supports localized appointment confirmation labels', () => {
    expect(formatClinicDateTime(appointment, 'en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })).toBe('Monday, August 3 at 1:30 PM');
  });
});
