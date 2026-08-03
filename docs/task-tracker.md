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
- [ ] M0.5 Initialize Git and create the first local commit.
- [!] M0.6 Create/connect GitHub repository and push (GitHub CLI is not installed; remote/auth required).

Acceptance: a clean checkout can install, test with at least 80% coverage, and build using documented commands.

## M1 — Application Foundation

- [x] M1.1 Responsive tablet-first app shell and desktop navigation walking skeleton.
- [x] M1.2 Design tokens for type, color, spacing, radius, focus, and elevation.
- [ ] M1.3 Accessible reusable button, field, card, badge, stepper, alert, and dialog patterns.
- [ ] M1.4 Routing and not-found/error behavior.
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

- [x] M3.1 Today’s schedule and status summary walking skeleton.
- [ ] M3.2 Provider and status filters.
- [ ] M3.3 Patient/appointment search.
- [ ] M3.4 Staff-assisted check-in.
- [ ] M3.5 Visit status transitions.
- [~] M3.6 Responsive tablet and desktop table layout complete; dedicated tablet card variant remains under usability review.

Acceptance: front-desk staff can identify arrivals and incomplete forms efficiently on tablet and desktop.

## M4 — Checkout

- [ ] M4.1 Service/product cart.
- [ ] M4.2 Decimal-safe subtotal, tax, discount, and balance calculations.
- [ ] M4.3 Mock payment success, decline, and retry.
- [ ] M4.4 Receipt preview and simulated delivery.
- [ ] M4.5 Visit completion and follow-up action.
- [ ] M4.6 Permissions and confirmation for sensitive actions.

Acceptance: the synthetic visit can move from ready-for-checkout to completed, including declined-payment recovery.

## M5 — Quality and Release Readiness

- [x] M5.1 Unit tests for current domain rules and adapter paths.
- [x] M5.2 Component/integration tests for current critical UI states.
- [x] M5.3 Current coverage exceeds 80%: 100% statements/lines/functions and 96.25% branches.
- [ ] M5.4 Complete and document WCAG 2.1 AAA audit: keyboard, focus, 7:1 text contrast, zoom, screen reader, voice control, timing, cognitive clarity, and applicable media criteria.
- [ ] M5.5 Tablet portrait/landscape and desktop visual verification.
- [ ] M5.6 Privacy review for fixtures, logs, URLs, caches, and session cleanup.
- [~] M5.7 Production build passes; release runbook remains open.

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
| D-01 | GitHub organization/user, repository name, and visibility | Project owner | Open |
| D-02 | Existing legacy frontend source/location | Project owner | Open |
| D-03 | Target clinic tablet hardware/browser | Clinic operations | Open |
| D-04 | Confirm Spanish as the first EU locale or select another | Product | Assumed Spanish for scaffold |
| D-05 | Real authentication and ASP.NET Core contracts | Backend/security | Mocked for now |
