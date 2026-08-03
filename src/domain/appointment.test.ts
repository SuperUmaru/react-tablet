import { describe, expect, it } from 'vitest';
import { displayName, initials, type Appointment } from './appointment';

const appointment = { patientFirstName: 'Maya', patientLastName: 'Thompson' } as Appointment;

describe('appointment formatting', () => {
  it('formats a full display name', () => expect(displayName(appointment)).toBe('Maya Thompson'));
  it('formats initials', () => expect(initials(appointment)).toBe('MT'));
  it('handles empty names safely', () => expect(initials({ patientFirstName: '', patientLastName: '' } as Appointment)).toBe(''));
});

