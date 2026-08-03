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
      if (['ipad-air-landscape','ipad-pro-landscape'].includes(testInfo.project.name)) {
        const fullyVisibleCards = await cards.evaluateAll((elements) => elements.filter((element) => {
          const card = element.getBoundingClientRect();
          return card.top >= 0 && card.bottom <= window.innerHeight;
        }).length);
        expect([4,6]).toContain(fullyVisibleCards);
      }
      if (testInfo.project.name.endsWith('-portrait')) {
        const searchGeometry = await page.locator('.patient-search-row .search-field').evaluate((field) => {
          const box = field.getBoundingClientRect();
          const icon = field.querySelector('svg')?.getBoundingClientRect();
          const input = field.querySelector('input')?.getBoundingClientRect();
          return { boxCenter:box.top + box.height / 2,iconCenter:icon ? icon.top + icon.height / 2 : 0,inputCenter:input ? input.top + input.height / 2 : 0 };
        });
        expect(Math.abs(searchGeometry.boxCenter - searchGeometry.iconCenter)).toBeLessThanOrEqual(2);
        expect(Math.abs(searchGeometry.boxCenter - searchGeometry.inputCenter)).toBeLessThanOrEqual(2);
        const selectAlignment = await page.locator('.patient-filter-row .ui-select-trigger').evaluateAll((triggers) => triggers.every((trigger) => {
          const box = trigger.getBoundingClientRect();
          const icon = trigger.querySelector('svg')?.getBoundingClientRect();
          return Boolean(icon && Math.abs((box.top + box.height / 2) - (icon.top + icon.height / 2)) <= 2 && box.left >= 0 && box.right <= window.innerWidth);
        }));
        expect(selectAlignment).toBe(true);
      }
    }
    await page.screenshot({
      path: `test-results/visual-audit/${testInfo.project.name}-${route.name}.png`,
      fullPage: true,
    });
  });
}
