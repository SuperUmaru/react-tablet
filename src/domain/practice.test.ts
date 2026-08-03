import { describe, expect, it } from 'vitest';
import { formatMoney, visitTotal, type CheckoutVisit } from './practice';

describe('practice calculations', () => {
  it('formats integer minor units safely', () => expect(formatMoney(12500)).toBe('$125.00'));
  it('calculates checkout total', () => expect(visitTotal({ items:[{id:'1',name:'Care',quantity:2,unitPriceMinor:1000}], discountMinor:200, taxMinor:100 } as CheckoutVisit)).toBe(1900));
});

