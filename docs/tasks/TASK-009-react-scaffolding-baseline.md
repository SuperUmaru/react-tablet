# TASK-009 — React Scaffolding Baseline

## Goal

Formalize the modern React architecture required for incremental migration: build, strict typing, state ownership, component primitives, and design tokens.

## Delivered

- Confirmed React 19, strict TypeScript, Vite, and legacy browser output.
- Formalized TanStack Query for server state and local React state for transient UI.
- Adopted Radix Primitives as the complex-control baseline.
- Added reusable `SelectField` and migrated Settings selects.
- Extracted semantic color, spacing, radius, control, and elevation tokens.
- Lazy-loaded Patients and Settings so the 90 KB Select behavior bundle is fetched only on routes that use it; the modern initial bundle is approximately 321.5 KB minified / 100.4 KB gzip.
- Documented folder responsibilities and incremental-adoption rules.

## Decision

Radix is used instead of Bootstrap 5 to avoid global collisions with the legacy Bootstrap 3 application. Tailwind can be evaluated separately for utility styling, but it is not required for Radix or the token system and should not be introduced as an unrelated full CSS rewrite.

## Verification

- TypeScript and ESLint: pass.
- Unit/integration: 29/29 pass.
- Coverage: 99.02% statements/lines, 95.51% branches, 86.41% functions.
- Modern and iOS 12+/Chrome 70+ legacy builds: pass.
- Full Playwright suite: 64/64 pass.
- iPad Air/Pro initial viewport: exactly four or six fully visible cards.
