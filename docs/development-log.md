# Development Log

This is an append-only record of material implementation decisions, completed work, validation, and blockers.

## 2026-08-03 — Project definition

- Created product requirements and phased modernization plan.
- Confirmed the workspace contains no legacy source code; the React foundation is therefore being created as a greenfield application with documented future coexistence boundaries.
- Defined tablet kiosk/staff modes as the primary quality target, desktop as fully supported, and mobile as out of scope.
- Backend work is represented by typed mock repositories and synthetic JSON-compatible records.

## 2026-08-03 — Execution setup

- Split delivery into repository controls, foundation, patient check-in, staff operations, checkout, quality, and legacy coexistence milestones.
- Set unit-test coverage gates to 80% for statements, branches, functions, and lines.
- Git is available locally. GitHub CLI is not installed, and no Git remote or GitHub credentials are available yet.

## 2026-08-03 — First React vertical slice

- Added Vite, React, strict TypeScript, ESLint, Vitest, V8 coverage, CI, i18n, design tokens, and a mock repository boundary.
- Implemented a tablet-focused patient appointment lookup/confirmation/check-in/reset flow and a responsive staff operations dashboard.
- Added English and Spanish resources using `react-i18next`.
- Added 15 unit/integration tests. Verified 100% statements, 97.36% branches, 100% functions, and 100% lines before the subsequent WCAG update.
- Raised the accessibility requirement to WCAG 2.1 Level AAA. Strengthened contrast tokens, skip navigation, document language updates, live loading state, focus behavior, and busy-state semantics. A manual criterion-by-criterion conformance report remains required before claiming conformance.
- Production audit identified overlapping React Router advisories with no clean 7.x resolution. Removed the router dependency; the current two-route walking skeleton uses native navigation and can adopt a patched router when route complexity warrants it.

## Log Entry Template

### YYYY-MM-DD — Short title

- Work completed:
- Decisions:
- Verification:
- Known issues/blockers:
- Next task IDs:
