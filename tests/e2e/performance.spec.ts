import { expect, test } from '@playwright/test';

test('stays responsive under old-tablet CPU and network constraints', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'tablet-low-power', 'Runs only with the throttled tablet profile');
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await session.send('Network.enable');
  await session.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: 1_600_000 / 8,
    uploadThroughput: 750_000 / 8
  });

  await page.addInitScript(() => {
    const observed: number[] = [];
    new PerformanceObserver((list) => observed.push(...list.getEntries().map((entry) => entry.duration)))
      .observe({ type: 'longtask', buffered: true });
    Object.defineProperty(window, '__longTasks', { value: observed });
  });

  const startedAt = Date.now();
  await page.goto('/check-in');
  await expect(page.getByRole('heading', { name: 'Welcome to Aurelia' })).toBeVisible();
  const readyMilliseconds = Date.now() - startedAt;
  const longTasks = await page.evaluate(() => (window as Window & { __longTasks: number[] }).__longTasks ?? []);

  await testInfo.attach('low-power-metrics', {
    body: JSON.stringify({ readyMilliseconds, longTasks }, null, 2),
    contentType: 'application/json'
  });
  expect(readyMilliseconds).toBeLessThan(5_000);
  expect(longTasks.filter((duration) => duration > 200)).toHaveLength(0);
});
