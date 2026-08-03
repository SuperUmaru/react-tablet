import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { safeJsonRequest } from './safeFetch';
import { ConcurrentEditError } from '../../domain/concurrency';

const schema = z.object({ id:z.string() });

describe('safeJsonRequest', () => {
  it('accepts same-origin validated JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ id:'patient-1' }), {
      status:200,
      headers:{ 'content-type':'application/json' },
    })));
    await expect(safeJsonRequest('/api/patients/1', schema)).resolves.toEqual({ id:'patient-1' });
  });

  it('blocks unapproved API origins before making a request', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(safeJsonRequest('https://attacker.example/patients', schema)).rejects.toThrow('Blocked API origin');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects non-JSON and invalid response contracts', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('hello', { status:200,headers:{ 'content-type':'text/plain' } })));
    await expect(safeJsonRequest('/api/patients/1', schema)).rejects.toThrow('Unexpected response type');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ id:42 }), { status:200,headers:{ 'content-type':'application/json' } })));
    await expect(safeJsonRequest('/api/patients/1', schema)).rejects.toThrow();
  });

  it('surfaces a version conflict without silently retrying', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ id:'patient-1',etag:'"v8"' }), {
      status:412,
      headers:{ 'content-type':'application/json' },
    })));
    const result = safeJsonRequest('/api/patients/1', schema);
    await expect(result).rejects.toBeInstanceOf(ConcurrentEditError);
    await expect(result).rejects.toMatchObject({ status:412,latest:{ id:'patient-1',etag:'"v8"' } });
  });
});
