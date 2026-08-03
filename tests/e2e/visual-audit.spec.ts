import { expect, test } from '@playwright/test';

const pages = [
  { name: 'overview', path: '/', ready: 'The clinic, at a glance' },
  { name: 'schedule', path: '/schedule', ready: 'Coordinate providers, arrivals, and patient readiness.' },
  { name: 'patients', path: '/patients', ready: 'Maya Thompson' },
  { name: 'checkout', path: '/checkout', ready: 'Ready for checkout' },
  { name: 'settings', path: '/settings', ready: 'Clinic identity' },
  { name: 'check-in', path: '/check-in', ready: 'Welcome to Aurelia' },
] as const;

for (const route of pages) {
  test(`${route.name} visual audit`, async ({ page }, testInfo) => {
    await page.goto(route.path);
    await expect(page.getByText(route.ready, { exact: true }).first()).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    if (route.name === 'patients') {
      const cards = page.locator('.patient-profile-card');
      await expect(cards.first()).toBeVisible();
      const cardsFit = await cards.evaluateAll((elements) => elements.every((element) => {
        const card = element.getBoundingClientRect();
        const content = element.closest('.dashboard')?.getBoundingClientRect();
        return Boolean(content && card.left >= content.left && card.right <= content.right && card.width > 250);
      }));
      expect(cardsFit).toBe(true);
    }
    await page.screenshot({
      path: `test-results/visual-audit/${testInfo.project.name}-${route.name}.png`,
      fullPage: true,
    });
  });
}
