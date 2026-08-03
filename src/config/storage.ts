export const STORAGE_KEYS = {
  patientLoadingMode: 'aurelia.ui.patient-loading-mode.v1',
} as const;

export type PatientLoadingMode = 'pages' | 'scroll';

export function readPatientLoadingMode(): PatientLoadingMode {
  try {
    const value = window.localStorage.getItem(STORAGE_KEYS.patientLoadingMode);
    return value === 'scroll' ? 'scroll' : 'pages';
  } catch {
    return 'pages';
  }
}

export function savePatientLoadingMode(value: PatientLoadingMode): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS.patientLoadingMode, value);
  } catch {
    // Storage can be unavailable in private/restricted WebViews; memory state still works.
  }
}
