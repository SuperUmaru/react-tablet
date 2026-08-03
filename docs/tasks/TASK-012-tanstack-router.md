# TASK-012 — Typed TanStack Router foundation

Status: Complete

## Purpose

Replace the temporary `window.location.pathname` route map with a modern typed router that supports patient detail and schedule search parameters without ad hoc URL parsing.

## Checklist

- [x] Install `@tanstack/react-router` as the routing library; retain TanStack Query for server state.
- [x] Define typed routes for Overview, Schedule, Patients, Patient Detail, Checkout, Settings, and Check-in.
- [x] Validate `patientId` search parameters and use a typed patient path parameter.
- [x] Add a not-found route instead of silently rendering Overview for unknown paths.
- [x] Use router links for in-app patient/detail/schedule transitions where practical.
- [x] Preserve and extend lazy loading through automatic file-route code splitting.
- [x] Update unit and Playwright navigation coverage.
- [x] Update architecture and README documentation.
- [x] Pass typecheck, lint, coverage, build, and multi-device Playwright.
- [x] Commit and push TASK-011 and TASK-012 documentation and implementation to GitHub.

## Decision

TanStack Query and TanStack Router solve different problems and are intended to coexist:

- Query owns remote/server data, cache freshness, prefetching, retries, and invalidation.
- Router owns typed paths, typed search parameters, route matching, navigation, lazy route bundles, and not-found behavior.

No global state library is added because there is still no cross-feature client-state requirement that Query + URL + local component state cannot handle.

## Acceptance criteria

1. No application route is selected through a manual path-to-element record.
2. Patient IDs are parsed through typed route search schemas.
3. Internal patient/detail/schedule links navigate without full document reload.
4. Unknown paths show an explicit not-found experience.
5. Existing workflows and quality gates remain green.

## Verification evidence

- TypeScript and ESLint with zero warnings: passed.
- Vitest: 38/38 tests passed.
- Coverage: 97.46% statements/lines, 92.56% branches, 85.71% functions.
- Vite modern/legacy build with generated route-level chunks: passed.
- Playwright: 64/64 tests passed after correcting the Patients parent layout to render its nested route outlet.
