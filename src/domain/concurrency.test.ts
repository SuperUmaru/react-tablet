import { describe, expect, it } from 'vitest';
import { versionedMutationHeaders } from './concurrency';

describe('versioned mutations', () => {
  it('sends the server ETag through If-Match', () => {
    expect(versionedMutationHeaders('"patient-v7"')).toEqual({ 'Content-Type':'application/json','If-Match':'"patient-v7"' });
  });

  it('refuses an unversioned update', () => {
    expect(() => versionedMutationHeaders('')).toThrow('server version is required');
  });
});
