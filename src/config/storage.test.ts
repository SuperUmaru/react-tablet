import { describe, expect, it } from 'vitest';
import { readPatientLoadingMode, savePatientLoadingMode, STORAGE_KEYS } from './storage';

describe('non-sensitive UI preference storage', () => {
  it('stores only the selected patient browsing mode under its versioned key', () => {
    savePatientLoadingMode('scroll');
    expect(readPatientLoadingMode()).toBe('scroll');
    expect(Object.keys(window.localStorage)).toEqual([STORAGE_KEYS.patientLoadingMode]);
  });

  it('falls back safely when the stored value is invalid', () => {
    window.localStorage.setItem(STORAGE_KEYS.patientLoadingMode, 'patient-data');
    expect(readPatientLoadingMode()).toBe('pages');
  });
});
