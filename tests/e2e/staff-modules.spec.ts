import { expect, test } from '@playwright/test';

test('staff can use schedule, patients, checkout, and settings', async ({ page }) => {
  await page.goto('/schedule');
  await page.getByPlaceholder('Search patient or service').fill('Sofia');
  await expect(page.getByText('Sofia Martinez')).toBeVisible();
  await expect(page.getByText('Maya Thompson')).toBeHidden();

  await page.getByRole('link', { name:'Patients' }).click();
  await page.getByPlaceholder('Search name or email').fill('Nora');
  await expect(page.getByText('Nora Bennett')).toBeVisible();

  await page.getByRole('link', { name:'Checkout' }).click();
  await page.getByRole('button', { name:/Pay \$444.00/ }).click();
  await expect(page.getByText('Payment complete. Receipt ready.')).toBeVisible();

  await page.getByRole('link', { name:'Settings' }).click();
  await page.getByLabel('Clinic name').fill('Aurelia Test Clinic');
  await page.getByRole('button', { name:'Save settings' }).click();
  await expect(page.getByText('Settings saved')).toBeVisible();
});
