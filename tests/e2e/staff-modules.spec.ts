import { expect, test } from '@playwright/test';

test('staff can use schedule, patients, checkout, and settings', async ({ page }, testInfo) => {
  await page.goto('/schedule');
  await expect(page.getByText('Maya Thompson')).toBeVisible();
  await testInfo.attach('schedule-layout', { body:await page.screenshot({ fullPage:true }), contentType:'image/png' });
  await page.getByPlaceholder('Search patient or service').fill('Sofia');
  await expect(page.getByText('Sofia Martinez')).toBeVisible();
  await expect(page.getByText('Maya Thompson')).toBeHidden();

  await page.getByRole('link', { name:'Patients' }).click();
  await expect(page.getByText('Showing 24 of 10,000')).toBeVisible();
  await page.getByRole('button', { name:'Infinite scroll' }).click();
  await expect(page.getByRole('button', { name:'Load more patients' })).toBeVisible();
  await page.getByPlaceholder('Search name, email, or phone').fill('nora@example.test');
  await expect(page.getByText('Showing 1 of 1')).toBeVisible();
  await expect(page.getByText('Nora Bennett')).toBeVisible();
  await page.getByRole('link', { name:'View patient' }).click();
  await expect(page.getByRole('heading', { name:'Nora Bennett' })).toBeVisible();
  await page.getByRole('link', { name:'Quick schedule' }).click();
  await expect(page.getByPlaceholder('Search patient or service')).toHaveValue('Nora Bennett');
  await page.getByRole('link', { name:'Patients' }).click();
  await testInfo.attach('patient-avatar-layout', { body:await page.screenshot({ fullPage:true }), contentType:'image/png' });

  await page.getByRole('link', { name:'Checkout' }).click();
  await page.getByRole('button', { name:/Pay \$444.00/ }).click();
  await expect(page.getByText('Payment complete. Receipt ready.')).toBeVisible();

  await page.getByRole('link', { name:'Settings' }).click();
  await page.getByLabel('Clinic name').fill('Aurelia Test Clinic');
  await page.getByRole('button', { name:'Save settings' }).click();
  await expect(page.getByText('Settings saved')).toBeVisible();
});
