# Aurelia Med Spa Practice UI

Tablet-first patient check-in and responsive staff operations UI built with React and TypeScript. Desktop is supported; mobile is not an initial release target.

## Run locally

```bash
npm install
npm run dev
```

The staff dashboard is at `/`; patient check-in is at `/check-in`.

Demo check-in credentials:

- Phone last four: `0184`
- Date of birth: `1988-04-12`

## Quality commands

```bash
npm run typecheck
npm run lint
npm run test:coverage
npm run build
```

Coverage is enforced at 80% for statements, branches, functions, and lines. New UI targets WCAG 2.1 Level AAA and requires both automated checks and a manual conformance review before release. See [requirements](docs/requirement.md), [delivery plan](docs/plan.md), [task tracker](docs/task-tracker.md), and [development log](docs/development-log.md).

## Data and API boundary

All current data is synthetic. UI features consume an `AppointmentRepository`, currently implemented by a mock adapter. An ASP.NET Core HTTP adapter can replace it without importing fixture JSON into components.
