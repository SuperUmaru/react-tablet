# Frontend Modernization Task Tracker

Last updated: 2026-08-03

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete
- `[!]` Blocked

## Delivery Priorities

1. Tablet kiosk and staff workflows (primary, polished target).
2. Desktop staff workflows (fully supported).
3. Mobile is explicitly out of scope for the initial release.

## M0 — Repository and Delivery Controls

- [x] M0.1 Create granular task tracker, per-task records, and development log.
- [x] M0.2 Scaffold Vite, React, and strict TypeScript.
- [x] M0.3 Configure ESLint, Vitest, and coverage thresholds (formatting automation remains a later refinement).
- [x] M0.4 Add CI checks for typecheck, lint, tests, coverage, and build.
- [x] M0.5 Initialize Git and create task-scoped local commits.
- [x] M0.6 Connect `origin` and push `main` to `SuperUmaru/react-tablet`.
- [x] M0.7 Make CI timezone-independent, use Node 24 GitHub Actions, and condition Playwright artifacts on execution (TASK-010).

Acceptance: a clean checkout can install, test with at least 80% coverage, and build using documented commands.

## M1 — Application Foundation

- [x] M1.1 Responsive tablet-first app shell and desktop navigation walking skeleton.
- [x] M1.2 Design tokens for type, color, spacing, radius, focus, and elevation.
- [~] M1.3 Radix-based Select wrapper and existing button/field/card/badge/stepper/alert patterns delivered; Dialog wrapper remains open.
- [x] M1.4 Routing and not-found behavior.
- [x] M1.4a Replace the temporary pathname map with typed TanStack Router routes and validated search parameters (TASK-012).
- [x] M1.5 English and Spanish localization foundation with locale formatting.
- [x] M1.6 Mock repository boundary with synthetic JSON-compatible data.
- [x] M1.7 Privacy-safe kiosk session reset behavior for the current walking skeleton.

Acceptance: the reference UI works at 768×1024, 1024×768, 1280×800, and 1440×900; all controls are keyboard operable.

## M2 — Tablet Patient Check-in

- [x] M2.1 Welcome and language selection.
- [x] M2.2 Appointment lookup.
- [x] M2.3 Appointment confirmation.
- [ ] M2.4 Contact details verification.
- [ ] M2.5 Intake questions and validation.
- [ ] M2.6 Consent acknowledgement.
- [ ] M2.7 Review and submit.
- [x] M2.8 Completion screen and manual reset (automatic timeout remains open).
- [~] M2.9 No-match and duplicate-submit handling complete; retry scenarios remain open.

Acceptance: a patient can complete the full synthetic-data flow using touch or keyboard, and patient context is cleared at the end.

## M3 — Staff Tablet and Desktop Operations

- [x] M3.0 Bound patient infinite-scroll DOM, prefetch adjacent pages, add patient detail/quick schedule, and enforce frontend storage/request safety (TASK-011).
- [x] M3.0a Debounce/single-flight infinite loading and define version-safe multi-device mutations (TASK-013).
- [x] M3.0b Correct and lock Patients portrait controls across iPad Mini/Air/Pro (TASK-014).

- [x] M3.1 Today’s schedule and status summary walking skeleton.
- [~] M3.2 Provider filter implemented; status filter remains open.
- [x] M3.3 Patient and appointment search walking slice.
- [ ] M3.4 Staff-assisted check-in.
- [ ] M3.5 Visit status transitions.
- [x] M3.6 Responsive appointment cards and patient/staff tablet/desktop layouts.

Acceptance: front-desk staff can identify arrivals and incomplete forms efficiently on tablet and desktop.

## M4 — Checkout

- [~] M4.1 Itemized service/product checkout summary implemented; editable cart remains open.
- [x] M4.2 Integer-minor-unit subtotal, tax, discount, and balance calculations.
- [~] M4.3 Mock payment success implemented; decline and retry remain open.
- [ ] M4.4 Receipt preview and simulated delivery.
- [ ] M4.5 Visit completion and follow-up action.
- [ ] M4.6 Permissions and confirmation for sensitive actions.

Acceptance: the synthetic visit can move from ready-for-checkout to completed, including declined-payment recovery.

## M5 — Quality and Release Readiness

- [x] M5.0 Add privacy-safe centralized frontend telemetry, trace IDs, error recovery, and restrained multilingual toasts (TASK-015).

- [x] M5.1 Unit tests for current domain rules and adapter paths.
- [x] M5.2 Component/integration tests for current critical UI states.
- [x] M5.3 Current coverage exceeds 80%: 98.87% statements/lines, 94.85% branches, and 83.56% functions.
- [ ] M5.4 Complete and document WCAG 2.1 AAA audit: keyboard, focus, 7:1 text contrast, zoom, screen reader, voice control, timing, cognitive clarity, and applicable media criteria.
- [x] M5.5 Automated tablet portrait/landscape and desktop visual verification across seven device profiles (TASK-008); physical-device sign-off remains under M5.9.
- [ ] M5.6 Privacy review for fixtures, logs, URLs, caches, and session cleanup.
- [~] M5.7 Production build passes; release runbook remains open.
- [x] M5.8 Playwright tablet/desktop journeys, axe scans, low-power budget, and failure artifact reporting (TASK-006).
- [~] M5.9 Certify modern and older tablet tiers, legacy bundle, low-power budgets, and physical device matrix.

Acceptance: automated gates pass, a manual WCAG 2.1 AAA conformance report has no open failures, and the tablet workflow has no known P0/P1 defects.

## M6 — Legacy Coexistence (requires legacy application access)

- [!] M6.1 Inventory jQuery/Bootstrap routes, plugins, CSS, globals, and API calls.
- [!] M6.2 Select first production migration slice.
- [ ] M6.3 Define mount/route bridge and DOM ownership.
- [ ] M6.4 Scope styles to prevent Bootstrap collisions.
- [ ] M6.5 Add feature flag, telemetry, and rollback.
- [ ] M6.6 Pilot, compare, stabilize, and retire replaced legacy code.

Acceptance: one React slice operates safely beside the legacy UI and can be rolled back independently.

## Current Blockers and Decisions

| ID | Item | Owner/input needed | Status |
| --- | --- | --- | --- |
| D-01 | GitHub organization/user, repository name, and visibility | Project owner | Resolved: `SuperUmaru/react-tablet` |
| D-02 | Existing legacy frontend source/location | Project owner | Open |
| D-03 | Target clinic tablet hardware/browser | Clinic operations | Open |
| D-04 | Confirm Spanish as the first EU locale or select another | Product | Assumed Spanish for scaffold |
| D-05 | Real authentication and ASP.NET Core contracts | Backend/security | Mocked for now |
