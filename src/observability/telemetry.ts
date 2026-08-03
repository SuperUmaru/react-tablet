export type TelemetryAction =
  | 'settings.save.started' | 'settings.save.succeeded'
  | 'checkout.payment.started' | 'checkout.payment.succeeded'
  | 'checkin.lookup.started' | 'checkin.completed';

export interface CriticalTelemetry {
  schemaVersion: 1;
  event: 'app_crash' | 'unhandled_error' | 'unhandled_rejection' | 'http_failure';
  severity: 'warning' | 'error' | 'critical';
  traceId: string;
  sessionId: string;
  occurredAt: string;
  route: string;
  status?: number;
  errorType?: string;
  stack?: string[];
  breadcrumbs: Array<{ action: TelemetryAction; route: string; occurredAt: string }>;
}

export type TelemetryTransport = (event: CriticalTelemetry) => void | Promise<void>;

const dynamicSegment = /^(?:\d+|[0-9a-f]{8}-[0-9a-f-]{27,}|pat[-_][\w-]+)$/i;

export function routeTemplate(pathname: string): string {
  return pathname.split('/').map((part) => dynamicSegment.test(part) ? ':id' : part).join('/') || '/';
}

function id(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function safeStack(error: unknown): string[] | undefined {
  if (!(error instanceof Error) || !error.stack) return undefined;
  return error.stack.split('\n').slice(1, 11).map((line) => line.replace(/https?:\/\/[^\s)]+/g, (raw) => {
    try { const url = new URL(raw); return `${url.origin}${routeTemplate(url.pathname)}`; } catch { return '[source]'; }
  }).slice(0, 300));
}

const defaultTransport: TelemetryTransport = (event) => {
  const body = JSON.stringify(event);
  if (navigator.sendBeacon?.('/api/telemetry/client-errors', new Blob([body], { type: 'application/json' }))) return;
  void fetch('/api/telemetry/client-errors', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => undefined);
};

export class TelemetryClient {
  private readonly sessionId = id();
  private readonly breadcrumbs: CriticalTelemetry['breadcrumbs'] = [];
  constructor(private readonly transport: TelemetryTransport = defaultTransport) {}

  record(action: TelemetryAction): void {
    this.breadcrumbs.push({ action, route: routeTemplate(location.pathname), occurredAt: new Date().toISOString() });
    if (this.breadcrumbs.length > 20) this.breadcrumbs.shift();
  }

  capture(event: CriticalTelemetry['event'], error?: unknown, status?: number): string {
    const traceId = id();
    const envelope: CriticalTelemetry = {
      schemaVersion: 1, event, severity: event === 'app_crash' ? 'critical' : status === 403 ? 'warning' : 'error',
      traceId, sessionId: this.sessionId, occurredAt: new Date().toISOString(),
      route: routeTemplate(location.pathname), status,
      errorType: error instanceof Error ? error.name.slice(0, 80) : undefined,
      stack: safeStack(error), breadcrumbs: [...this.breadcrumbs],
    };
    try { void this.transport(envelope); } catch { /* Telemetry must never break the app. */ }
    return traceId;
  }
}

export const telemetry = new TelemetryClient();

export function installGlobalErrorCapture(): () => void {
  const onError = (event: ErrorEvent) => telemetry.capture('unhandled_error', event.error);
  const onRejection = (event: PromiseRejectionEvent) => telemetry.capture('unhandled_rejection', event.reason);
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  return () => { window.removeEventListener('error', onError); window.removeEventListener('unhandledrejection', onRejection); };
}
