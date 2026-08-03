# Aurelia Med Spa Practice UI

Tablet-first patient check-in and responsive staff operations UI built with React and TypeScript. Desktop is supported; mobile is not an initial release target.

Technology baseline: React 19, strict TypeScript, Vite, TanStack Query for server state, Radix Primitives for complex accessible controls, semantic CSS design tokens, Vitest, and Playwright. See the [React architecture baseline](docs/react-architecture.md).

## Run locally

```bash
npm install
npm run dev
```

Working routes:

- `/` — clinic-flow Overview
- `/schedule` — appointment board and filtering
- `/patients` — patient directory and search
- `/checkout` — itemized visit payment simulation
- `/settings` — clinic/kiosk preferences
- `/check-in` — patient tablet check-in

Demo check-in credentials:

- Phone last four: `0184`
- Date of birth: `1988-04-12`

## Quality commands

```bash
npm run typecheck
npm run lint
npm run test:coverage
npm run build
npm run test:e2e:tablet
npm run test:e2e
```

Coverage is enforced at 80% for statements, branches, functions, and lines. New UI targets WCAG 2.1 Level AAA and requires both automated checks and a manual conformance review before release. See [requirements](docs/requirement.md), [delivery plan](docs/plan.md), [task tracker](docs/task-tracker.md), and [development log](docs/development-log.md).

Playwright runs tablet landscape, tablet portrait, a throttled low-power tablet budget, and desktop Chromium against the production bundle. See [tablet automation](docs/playwright-tablet-testing.md), [compatibility strategy](docs/tablet-compatibility-performance.md), and the latest [code review](docs/code-review-2026-08-03.md).

## Design and implementation

The application is a tablet-first React 19 + TypeScript interface built with Vite. At widths up to 1100 px the staff shell becomes a compact 82 px navigation rail, preserving the content area on older 768–1024 px tablets. Desktop uses the expanded navigation. Touch controls target at least 44 px, layouts avoid horizontal overflow, reduced-motion preferences are respected, and automated axe checks support the WCAG 2.1 AAA goal. Manual accessibility review is still required before claiming conformance.

The code is organized around replaceable boundaries:

- `pages` compose workflow-specific UI and React Query state.
- `components` contain reusable shell, navigation, status, and branding elements.
- `domain` defines framework-independent TypeScript contracts.
- `data/mock` implements those contracts with deterministic JSON-style sample responses.
- An ASP.NET Core HTTP adapter can replace a mock repository without changing page components.

Vite is used because this is a client application being introduced incrementally alongside a legacy UI. It gives a small, fast development/build layer without imposing a server rendering architecture. The official legacy plugin emits modern and compatibility bundles targeting iOS 12+ and Chrome/WebView 70+.

## 10,000-patient search and infinite loading sample

The Patients page demonstrates large-list handling without putting 10,000 DOM cards on a tablet. `MockPracticeRepository` creates a deterministic 10,000-record in-memory JSON dataset once, then exposes the same paged contract expected from ASP.NET Core. The user can switch between **Pages** and **Infinite scroll**; fast, predictable pagination is the default for older hardware.

```json
{
  "items": [{ "id": "patient-00025", "firstName": "Nora", "lastName": "Bennett" }],
  "page": 0,
  "pageSize": 24,
  "total": 10000,
  "hasMore": true
}
```

The search box debounces input for 250 ms before changing the React Query cache key. It searches name, email, and phone, with additional membership, balance, next-visit, and sorting controls. Each response contains only 24 records. Page mode provides Previous/Next controls and the current page count. In infinite mode, an `IntersectionObserver` requests the next page when the loading sentinel approaches the viewport; an explicit “Load more patients” button remains as a keyboard-accessible fallback. The result summary announces “Showing X of Y” through an `aria-live` region.

Landscape cards use a compact tablet density: the initial iPad Air/Pro viewport is automatically tested to contain exactly four or six fully visible cards. New cards use a short staggered entry transition and pagination/mode changes scroll smoothly; both behaviors collapse to effectively no motion when `prefers-reduced-motion` is enabled.

This design keeps initial rendering bounded, avoids a 10,000-node layout/paint cost on old iPads and Android WebViews, caches each search independently, and maps directly to an API such as:

```text
GET /api/patients?page=0&pageSize=24&search=maya
```

For a production backend, enforce a maximum page size, index normalized name/email fields, return a stable sort plus cursor when records change frequently, and cancel stale requests with `AbortSignal` in the HTTP adapter.

## Visual review and tablet automation

Run all browser workflows:

```bash
npm run test:e2e
```

Run only tablet projects:

```bash
npm run test:e2e:tablet
```

The visual audit captures Overview, Schedule, Patients, Checkout, Settings, and Check-in for every configured device profile:

- Legacy 1024×768 tablet/iPad landscape
- 768×1024 tablet portrait
- iPad Air landscape, 1180×820 at 2× scale
- iPad Pro landscape, 1366×1024 at 2× scale
- Android tablet landscape, 1280×800 at 1.5× scale
- Large/Surface-style tablet, 1440×960 at 1.5× scale
- Desktop, 1440×900

```bash
npx playwright test tests/e2e/visual-audit.spec.ts
```

Screenshots are written to `test-results/visual-audit` with the device name in each filename. Playwright checks horizontal overflow and verifies every Patient card stays fully inside the dashboard with a usable minimum width, preventing partial “2.1 card” rows. It also checks workflow behavior, keyboard/touch-relevant controls, accessibility, and a throttled low-power tablet performance budget.

## Data and API boundary

All current data is synthetic and contains no patient health information. `AppointmentRepository` and `PracticeRepository` are mock adapters with asynchronous JSON-compatible results. Replace them with ASP.NET Core adapters after OpenAPI contracts are confirmed; UI components should never import fixture JSON directly.
