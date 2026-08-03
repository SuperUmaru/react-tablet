import { z } from 'zod';
import { ConcurrentEditError } from '../../domain/concurrency';
import { HttpRequestError } from '../../observability/HttpRequestError';
import { telemetry } from '../../observability/telemetry';

const DEFAULT_TIMEOUT_MS = 15_000;

function allowedOrigins(): Set<string> {
  const configured = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_ORIGIN?.trim();
  return new Set([window.location.origin, ...(configured ? [new URL(configured).origin] : [])]);
}

export async function safeJsonRequest<T>(
  input: string | URL,
  schema: z.ZodType<T>,
  init: RequestInit = {},
): Promise<T> {
  const url = new URL(input, window.location.origin);
  if (!allowedOrigins().has(url.origin)) throw new Error('Blocked API origin');
  if (window.location.protocol === 'https:' && url.protocol !== 'https:') throw new Error('Blocked insecure API request');

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...init,
      credentials: 'same-origin',
      headers: { Accept: 'application/json', ...init.headers },
      redirect: 'error',
      signal: controller.signal,
    });
    if (response.status === 409 || response.status === 412) {
      const latest = response.headers.get('content-type')?.includes('application/json') ? await response.json() : null;
      throw new ConcurrentEditError(response.status, latest);
    }
    if (response.status === 403 || response.status >= 500) {
      const traceId = telemetry.capture('http_failure', undefined, response.status);
      throw new HttpRequestError(response.status, traceId);
    }
    if (!response.ok) throw new HttpRequestError(response.status);
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) throw new Error('Unexpected response type');
    return schema.parse(await response.json());
  } finally {
    window.clearTimeout(timeout);
  }
}
