# Aurelia Med Spa Practice UI

A tablet-first React practice-management frontend for med-spa clinic operations. It demonstrates patient check-in, staff scheduling, patient search, checkout, settings, localization, and privacy-safe frontend observability using synthetic JSON data.

Tablet portrait and landscape are the primary targets. Desktop is supported; mobile is outside the current release scope.

## Features

- Operations Overview with daily clinic flow and attention signals.
- Schedule grouped by clinic time, filtering, and patient-aware quick scheduling.
- 10,000-record Patients sample with search, filters, sorting, pagination, optional infinite scroll, adjacent-page prefetching, and a 96-card DOM limit.
- Patient detail navigation without storing patient data in Web Storage.
- Checkout with itemized totals and simulated payment completion.
- Clinic and kiosk Settings.
- Touch-friendly tablet check-in with English and Spanish support.
- Accessible, translated, deduplicated success/error notifications.
- React crash, unhandled error, 403, and 5xx telemetry sent through a privacy-safe same-origin contract for Azure Application Insights or AWS CloudWatch forwarding.
- Multi-device visual tests, low-power tablet performance checks, and failure screenshots/traces.

> All data is synthetic. Authentication, authorization, tenant isolation, real payments, audit logs, concurrency enforcement, and provider telemetry forwarding require the ASP.NET Core backend.

## Technology

React 19, strict TypeScript, Vite, TanStack Router, TanStack Query, Radix UI, i18next, Zod, Vitest, Testing Library, Playwright, and axe-core. Vite also emits compatibility bundles targeting iOS 12+ and Chrome/WebView 70+.

## Run locally

Node.js 22 is recommended.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite. Demo check-in values:

- Phone: `0184`
- Date of birth: `1988-04-12`

Main routes: `/`, `/schedule`, `/patients`, `/checkout`, `/settings`, and `/check-in`.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run test:coverage
npm run build
npm run test:e2e:tablet
npm run test:e2e
```

Coverage is enforced at 80% for statements, branches, functions, and lines. Playwright covers multiple iPad, Android tablet, large-tablet, desktop, portrait, landscape, visual, workflow, accessibility, and throttled low-power profiles. Screenshots and failure evidence are written under `test-results`; the HTML report is written to `playwright-report`.

WCAG 2.1 Level AAA is the release target. Automated checks currently cover detectable A/AA issues; manual AAA review and physical-device certification remain required before claiming conformance.

## Architecture and documentation

Pages consume repository interfaces through TanStack Query; current repositories return asynchronous JSON-compatible samples and can be replaced by ASP.NET Core adapters. TanStack Router provides typed, code-split routes. Only the patient loading-mode preference is persisted locally; patient, token, clinical, and payment data are not.

- [Requirements](docs/requirement.md) and [delivery plan](docs/plan.md)
- [React architecture](docs/react-architecture.md)
- [Tablet compatibility and performance](docs/tablet-compatibility-performance.md)
- [Playwright tablet testing](docs/playwright-tablet-testing.md)
- [Frontend security](docs/frontend-security.md) and [multi-device concurrency](docs/multi-device-concurrency.md)
- [Observability and notifications](docs/observability.md)
- [Deep code review](docs/code-review-2026-08-03.md)
- [Task tracker](docs/task-tracker.md) and [development log](docs/development-log.md)
