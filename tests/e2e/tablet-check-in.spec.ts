import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('tablet patient check-in', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/check-in');
  });

  test('completes the patient journey and clears identity data', async ({ page }, testInfo) => {
    await expect(page.getByRole('heading', { name: 'Welcome to Aurelia' })).toBeVisible();
    await page.getByLabel('Last 4 digits of your phone number').fill('0184');
    await page.getByLabel('Date of birth').fill('1988-04-12');
    await page.getByRole('button', { name: 'Find my appointment' }).click();
    await expect(page.getByRole('heading', { name: /Maya, is this your visit/ })).toBeVisible();

    await testInfo.attach('tablet-confirmation', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png'
    });

    await page.getByRole('button', { name: 'Yes, check me in' }).click();
    await expect(page.getByRole('heading', { name: 'You’re checked in!' })).toBeVisible();
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByLabel('Last 4 digits of your phone number')).toHaveValue('');
    await expect(page.getByLabel('Date of birth')).toHaveValue('');
  });

  test('shows a useful no-match recovery message', async ({ page }) => {
    await page.getByLabel('Last 4 digits of your phone number').fill('9999');
    await page.getByLabel('Date of birth').fill('2000-01-01');
    await page.getByRole('button', { name: 'Find my appointment' }).click();
    await expect(page.getByRole('alert')).toContainText('couldn’t find a matching appointment');
    await expect(page.getByRole('button', { name: 'Find my appointment' })).toBeEnabled();
  });

  test('has no automatically detectable WCAG A/AA violations', async ({ page }, testInfo) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    await testInfo.attach('axe-results', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
    expect(results.violations).toEqual([]);
  });
});

