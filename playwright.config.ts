import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: 'test-results/artifacts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['line'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    colorScheme: 'light',
    locale: 'en-US',
    timezoneId: 'Asia/Bangkok',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  expect: { timeout: 7_000 },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: 'tablet-landscape',
      testIgnore: /performance\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 }, hasTouch: true }
    },
    {
      name: 'tablet-portrait',
      testIgnore: /performance\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 }, hasTouch: true }
    },
    {
      name: 'ipad-air-landscape',
      testMatch: /visual-audit\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1180, height: 820 }, hasTouch: true, deviceScaleFactor: 2 }
    },
    {
      name: 'ipad-mini-portrait',
      testMatch: /visual-audit\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 744, height: 1133 }, hasTouch: true, deviceScaleFactor: 2 }
    },
    {
      name: 'ipad-air-portrait',
      testMatch: /visual-audit\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 }, hasTouch: true, deviceScaleFactor: 2 }
    },
    {
      name: 'ipad-pro-portrait',
      testMatch: /visual-audit\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 1366 }, hasTouch: true, deviceScaleFactor: 2 }
    },
    {
      name: 'ipad-pro-landscape',
      testMatch: /visual-audit\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 1024 }, hasTouch: true, deviceScaleFactor: 2 }
    },
    {
      name: 'android-tablet-landscape',
      testMatch: /visual-audit\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 }, hasTouch: true, deviceScaleFactor: 1.5 }
    },
    {
      name: 'large-tablet-landscape',
      testMatch: /visual-audit\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 960 }, hasTouch: true, deviceScaleFactor: 1.5 }
    },
    {
      name: 'desktop-chromium',
      testIgnore: /performance\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }
    },
    {
      name: 'tablet-low-power',
      testMatch: /performance\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 }, hasTouch: true, deviceScaleFactor: 1 }
    }
  ]
});
