import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('staff operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Maya Thompson')).toBeVisible();
  });

  test('renders the daily schedule without horizontal page overflow', async ({ page }, testInfo) => {
    await expect(page.getByRole('heading', { name: 'Good morning, Olivia' })).toBeVisible();
    await expect(page.getByText('HydraFacial Signature')).toBeVisible();
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasOverflow).toBe(false);
    await testInfo.attach('staff-layout', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  });

  test('opens the patient check-in experience', async ({ page }) => {
    await page.getByRole('link', { name: 'Start patient check-in' }).click();
    await expect(page).toHaveURL(/\/check-in$/);
    await expect(page.getByRole('heading', { name: 'Welcome to Aurelia' })).toBeVisible();
  });

  test('has no automatically detectable WCAG A/AA violations', async ({ page }, testInfo) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    await testInfo.attach('axe-results', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
    expect(results.violations).toEqual([]);
  });
});
