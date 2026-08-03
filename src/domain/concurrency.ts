export class ConcurrentEditError extends Error {
  constructor(public readonly status:409 | 412, public readonly latest:unknown) {
    super('This record was changed on another device.');
    this.name = 'ConcurrentEditError';
  }
}

export function versionedMutationHeaders(etag:string):HeadersInit {
  if (!etag.trim()) throw new Error('A server version is required before updating this record.');
  return { 'Content-Type':'application/json','If-Match':etag };
}
