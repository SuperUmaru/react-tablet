# TASK-002 — Modern React and TypeScript Foundation

## Why

The new UI needs strict, testable boundaries so it can consume JSON fixtures now and ASP.NET Core APIs later without rewriting components.

## Technical choices

- React 19 and strict TypeScript for typed components and domain boundaries.
- Vite for fast SPA development and easy embedding beside a legacy application.
- TanStack Query for async/server state.
- Repository interfaces isolate UI from synthetic JSON and future HTTP adapters.
- `react-i18next` provides English/Spanish namespaces and locale switching.
- Feature/domain/data/component separation keeps migration slices independently reviewable.
- Native navigation is sufficient for the current two-route skeleton and avoids the active React Router advisory; adopt a patched router when route complexity warrants it.

## Completed

- Vite application, strict TypeScript project references, ESLint, Vitest, and production build.
- Domain model, repository interface, synthetic fixture, and mock adapter.
- Shared brand, language, and status components.
- Design tokens and tablet/desktop responsive foundations.
- GitHub Actions quality workflow.

## Acceptance evidence

- `npm run typecheck`: pass.
- `npm run lint`: pass with zero warnings.
- `npm run build`: pass; production JS is approximately 92.61 kB gzip.
- `npm audit --omit=dev`: zero vulnerabilities after removing affected router dependency.

## Follow-up

- Add HTTP repository adapter after OpenAPI contracts exist.
- Add runtime environment schema and production authentication adapter.

