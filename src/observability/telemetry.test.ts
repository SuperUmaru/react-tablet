import { describe, expect, it, vi } from 'vitest';
import { TelemetryClient, routeTemplate } from './telemetry';

describe('critical telemetry', () => {
  it('templates identifiers and never includes query strings', () => {
    expect(routeTemplate('/patients/12345')).toBe('/patients/:id');
    expect(routeTemplate('/patients/550e8400-e29b-41d4-a716-446655440000')).toBe('/patients/:id');
  });

  it('sends only bounded allowlisted breadcrumbs and no error message', () => {
    const transport = vi.fn();
    const client = new TelemetryClient(transport);
    for (let index = 0; index < 25; index += 1) client.record('settings.save.started');
    const traceId = client.capture('app_crash', new Error('Patient Jane secret'));
    expect(traceId).toBeTruthy();
    const event = transport.mock.calls[0]![0];
    expect(event.breadcrumbs).toHaveLength(20);
    expect(JSON.stringify(event)).not.toContain('Jane secret');
    expect(event.errorType).toBe('Error');
  });
});
