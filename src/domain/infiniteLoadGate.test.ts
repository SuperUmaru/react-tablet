import { describe, expect, it } from 'vitest';
import { InfiniteLoadGate } from './infiniteLoadGate';

describe('InfiniteLoadGate', () => {
  it('allows only one request during an intersection burst', () => {
    const gate = new InfiniteLoadGate(150);
    expect(gate.enter('filter:page-1', 1000)).toBe(true);
    expect(gate.enter('filter:page-1', 1000)).toBe(false);
    gate.finish('filter:page-1');
    expect(gate.enter('filter:page-2', 1200)).toBe(false);
  });

  it('rearms only after the sentinel leaves and respects cooldown', () => {
    const gate = new InfiniteLoadGate(150);
    expect(gate.enter('page-1', 1000)).toBe(true);
    gate.finish('page-1');
    gate.leave();
    expect(gate.enter('page-2', 1100)).toBe(false);
    expect(gate.enter('page-2', 1200)).toBe(true);
    gate.reset();
    expect(gate.enter('new-filter:page-1', 1201)).toBe(true);
  });
});
