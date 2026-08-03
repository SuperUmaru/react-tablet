export class HttpRequestError extends Error {
  constructor(public readonly status: number, public readonly traceId?: string) {
    super(status === 403 ? 'Access denied' : 'Request failed');
    this.name = 'HttpRequestError';
  }
}
