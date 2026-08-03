# Playwright Tablet Testing and Tracking

## What is tracked

The Playwright suite treats tablet landscape and portrait as first-class projects rather than relying on a responsive browser window.

| Project | Viewport | Touch | Purpose |
| --- | --- | --- | --- |
| `tablet-landscape` | 1024×768 | Yes | Primary in-clinic kiosk/staff orientation |
| `tablet-portrait` | 768×1024 | Yes | Required tablet fallback orientation |
| `desktop-chromium` | 1440×900 | No | Staff desktop regression |
| `tablet-low-power` | 1024×768 | Yes | 4× CPU slowdown and constrained-network performance gate |

Current browser journeys track:

- Successful appointment lookup → confirmation → arrival → patient-data reset.
- No-match recovery and ability to retry.
- Dashboard data and horizontal overflow.
- Dashboard-to-kiosk navigation.
- Automated axe checks for detectable WCAG 2.0/2.1 A and AA violations.
- Throttled readiness and long-task metrics for an approximate low-power environment.
- Screenshots attached to successful layout/journey results.
- Trace, screenshot, and video retained when a test fails.

Automated axe checks do not certify WCAG 2.1 AAA. Manual AAA evaluation remains a release gate.

## First-time setup

```powershell
npm.cmd install
npm.cmd run test:e2e:install
```

The second command downloads Chromium used by Playwright. Each normal Playwright run builds the production application and starts Vite Preview automatically, so performance results measure bundled assets rather than the development module server.

## Run commands

Tablet projects only:

```powershell
npm.cmd run test:e2e:tablet
```

All tablet and desktop projects:

```powershell
npm.cmd run test:e2e
```

Watch the primary tablet browser execute:

```powershell
npm.cmd run test:e2e:headed
```

Interactive Playwright test explorer:

```powershell
npm.cmd run test:e2e:ui
```

Open the most recent HTML report:

```powershell
npm.cmd run test:e2e:report
```

Run one test by title:

```powershell
npx.cmd playwright test -g "completes the patient journey" --project=tablet-landscape
```

## Where results are stored

- `playwright-report/index.html`: interactive report with steps and attachments.
- `test-results/results.json`: machine-readable test history input.
- `test-results/artifacts/`: traces, screenshots, and videos retained according to the configuration.

These directories are ignored by Git. GitHub Actions uploads them as a `playwright-report` artifact for 14 days even when tests fail.

## Debug a failure

1. Open `playwright-report/index.html` with `npm.cmd run test:e2e:report`.
2. Select the failed project and test.
3. Inspect the error, screenshot, video, and attachment.
4. Open a retained trace:

```powershell
npx.cmd playwright show-trace test-results/artifacts/<trace-file>.zip
```

The trace provides DOM snapshots, network requests, console messages, action timing, and before/after screenshots for every step.

## Adding a tablet test

- Prefer accessible locators: `getByRole`, `getByLabel`, and visible names.
- Test user outcomes, not React implementation details.
- Never include real patient data in fixtures, screenshots, traces, or reports.
- Assert no horizontal page overflow on both tablet projects.
- Attach a screenshot at meaningful checkpoints when visual review helps.
- Add an axe scan for every materially different page state, while keeping the manual AAA checklist current.
- Make mock state deterministic before expanding tests that mutate data.

## CI behavior

GitHub Actions installs Chromium and runs all three projects after unit coverage and production build. CI retries failures twice, uses two workers, and rejects committed `test.only`. Reports are uploaded whether the job passes or fails.
