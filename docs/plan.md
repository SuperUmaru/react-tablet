# Med Spa Frontend Modernization Plan

## 1. Delivery Strategy

Deliver the platform in safe vertical slices while the legacy jQuery/Bootstrap application remains live. The first slice optimizes the internal tablet check-in/checkout workflow. The same architecture then expands into desktop operations and replaces legacy routes incrementally.

This plan assumes an empty React workspace and mock JSON data. Dates are estimates to refine after legacy-code, device, workflow, and API discovery.

## 2. Workstreams

1. Product discovery and legacy inventory.
2. Internal-launch jQuery/Bootstrap stabilization.
3. React/TypeScript platform foundation.
4. Tablet check-in and checkout.
5. Desktop staff workflows.
6. Legacy/React coexistence and incremental migration.
7. Design system and commercial UI refresh.
8. Internationalization and EU readiness.
9. Accessibility, quality, security, and operations.
10. ASP.NET Core API contract integration when endpoints are available.

## 3. Proposed Architecture

```text
src/
  app/                 # startup, providers, router, layouts, guards
  features/            # check-in, schedule, patients, checkout, settings
  domain/              # frontend domain types and business rules
  data/
    contracts/         # repository interfaces and DTO schemas
    mock/              # JSON fixtures and mock adapters
    http/              # future ASP.NET Core adapters
  components/
    ui/                # accessible primitives
    patterns/          # page, form, table, workflow patterns
  i18n/                # setup and locale resources
  styles/              # tokens, reset, global app styles
  test/                # test utilities and scenario builders
```

The UI calls feature services/repositories, never fixture files. Mock and HTTP adapters are selected at application startup. This preserves one component tree when real APIs replace JSON samples.

## 4. Phased Roadmap

### Phase 0 — Discovery and baseline (Week 1)

- Inventory legacy routes, jQuery plugins, Bootstrap overrides, shared globals, API calls, forms, and browser/device dependencies.
- Observe the real clinic check-in and checkout workflow with front-desk staff.
- Record current defects, task timings, accessibility issues, and performance baseline.
- Confirm internal-launch scope, tablet hardware, browser, peripherals, roles, privacy constraints, and support process.
- Create a migration matrix: retain, repair, wrap temporarily, rewrite, or retire.
- Draft API resource and error conventions with the .NET team.

Deliverables:

- Approved workflow maps and P0 scope.
- Legacy inventory and risk register.
- Browser/device matrix.
- Initial architecture decision records (ADRs).
- Measurable internal-launch success criteria.

Exit gate: product, clinic operations, backend, security, and frontend agree on the first vertical slice and its acceptance tests.

### Phase 1 — Stabilize the existing tablet UI (Weeks 1–4, in parallel with foundation)

- Reproduce and prioritize current jQuery/Bootstrap tablet defects.
- Fix blockers in check-in/checkout, layout, validation, focus/keyboard behavior, session cleanup, and double submission.
- Reduce fragile global event handlers and document required legacy integrations.
- Add high-value regression tests around critical existing flows where feasible.
- Prepare an operational runbook, release checklist, feature toggle/rollback approach, and known limitations.

Exit gate: the current stack passes internal-launch smoke tests on actual clinic hardware and has an accepted rollback/support plan.

### Phase 2 — React foundation (Weeks 1–3)

- Scaffold Vite + React + strict TypeScript.
- Configure path aliases, environment validation, linting, formatting, tests, production builds, and CI.
- Add routing, query/cache layer, small UI/session store, forms/schema validation, i18n, and error boundaries.
- Define feature-oriented directory boundaries and import rules.
- Implement design tokens and accessible UI primitives: button, input, select, checkbox, radio, dialog, alert, toast, card, stepper, table, skeleton, and error/empty states.
- Build responsive application shells for kiosk, staff tablet, and desktop.
- Add mock repository interfaces, JSON fixtures, latency/error scenarios, and adapter selection.
- Establish privacy-safe logging, telemetry hooks, feature flags, and environment configuration.

Exit gate: CI is green and a reference feature demonstrates routing, responsive behavior, translations, accessible forms, mocked data, error states, and tests.

### Phase 3 — Tablet check-in vertical slice (Weeks 3–6)

- Implement welcome/language, session initialization, appointment lookup, confirmation, demographics, intake forms, consent/signature, review, submission, success, and reset.
- Implement a state machine or explicit workflow model so steps and valid transitions are testable.
- Add save/resume behavior in the mock layer, duplicate-submit protection, timeout warning, staff-help path, and recoverable API failures.
- Validate landscape and portrait layouts on the target tablet.
- Add accessibility, visual, integration, and end-to-end coverage for happy and exception paths.

Exit gate: clinic users complete moderated check-in tests successfully on target hardware; privacy/session reset and error recovery are accepted.

### Phase 4 — Staff flow and checkout (Weeks 5–8)

- Implement today's schedule/queue, patient lookup, appointment status, form status, and staff-assisted check-in.
- Implement checkout cart, services/products, packages/discounts, locale-safe totals, mock payment states, receipt, and follow-up scheduling.
- Add permission checks, financial-action confirmations, audit-event interfaces, and concurrency/stale-record scenarios.
- Provide tablet layouts and denser desktop layouts from the same feature modules.

Exit gate: end-to-end tests cover arrival to completed mock checkout, including decline/retry and role restrictions; clinic operations signs off.

### Phase 5 — Coexistence pilot and first legacy replacement (Weeks 6–9)

- Choose a bounded, high-value route with limited cross-screen coupling.
- Add route-level handoff between legacy and React, sharing only documented session/location/navigation contracts.
- Scope styles and isolate DOM ownership.
- Gate the React route by clinic/user cohort and collect privacy-safe telemetry.
- Run legacy and React acceptance comparisons, then pilot with internal users.
- Document rollback and legacy deletion criteria.

Exit gate: the React slice runs in production for the pilot cohort with acceptable errors, performance, and task completion; rollback is proven.

### Phase 6 — Desktop expansion and commercial refresh (Weeks 9+)

- Prioritize modules using user value, defect rate, dependency complexity, and migration effort.
- Migrate one vertical feature at a time: schedule, patient profile, appointments, forms/consents, billing/payments, products/packages, reports, then settings/administration.
- Pair each migration with workflow validation, approved parity decisions, responsive design, localization, accessibility, telemetry, tests, staged rollout, and legacy retirement.
- Expand the design system only for proven reusable needs.

Exit gate per module: acceptance criteria pass, pilot metrics are stable, rollback window closes, and obsolete legacy code is safely retired.

### Phase 7 — EU localization and launch readiness (starts in Phase 2; certification before commercial launch)

- Confirm second locale, regional formats, currencies, tax labels, legal text, privacy notices, and content owners.
- Externalize all text and translate feature namespaces as features stabilize.
- Run pseudo-localization early to expose truncation and concatenation defects.
- Complete professional translation, in-context linguistic review, and regression tests in both locales.
- Validate GDPR-facing flows such as consent presentation, data requests, and privacy notices with legal/security owners.

Exit gate: localization checklist, linguistic QA, regional formatting, accessibility, legal copy, and country-specific operational rules are approved.

## 5. Initial Backlog

### Epic A — Discovery and governance

- [ ] Inventory legacy pages, plugins, globals, API calls, CSS overrides, and test coverage.
- [ ] Map patient, front-desk, provider, and manager journeys.
- [ ] Confirm P0/P1 scope and definitions of done.
- [ ] Create ADRs for Vite vs Next.js, component foundation, state layers, routing, CSS isolation, auth, and API generation.
- [ ] Create migration matrix, dependency map, risk register, and decision log.
- [ ] Define ownership between frontend, backend, product, design, QA, security, localization, and clinic operations.

### Epic B — Legacy internal-launch cleanup

- [ ] Create reproducible defect list with device/browser evidence.
- [ ] Fix tablet layout and touch-target defects.
- [ ] Fix validation, focus, keyboard, modal, and session-reset defects.
- [ ] Prevent duplicate check-in/payment actions.
- [ ] Add critical smoke/regression coverage.
- [ ] Test on clinic hardware and document rollback/support.

### Epic C — Engineering foundation

- [ ] Scaffold React/TypeScript project and CI checks.
- [ ] Define route structure and kiosk/staff/desktop shells.
- [ ] Implement runtime configuration and environment validation.
- [ ] Add error boundaries, notifications, loading/empty/error patterns.
- [ ] Configure unit, integration, E2E, accessibility, and visual tests.
- [ ] Add privacy-safe telemetry and release/version display.

### Epic D — Design system

- [ ] Define semantic design tokens and responsive rules.
- [ ] Build accessible primitives and documentation/examples.
- [ ] Create form, workflow, data table, status, and page-layout patterns.
- [ ] Test keyboard, screen reader, 200% zoom, reduced motion, high contrast, touch, and text expansion.
- [ ] Establish visual regression baselines.

### Epic E — Mock data and API contracts

- [ ] Define frontend domain types and API DTO boundaries.
- [ ] Define repository interfaces and mock/HTTP adapters.
- [ ] Create synthetic JSON scenario fixtures.
- [ ] Add latency, validation, authorization, failure, decline, and stale-write simulation.
- [ ] Agree with backend on authentication, errors, pagination, filtering, sorting, concurrency, idempotency, money, dates, file upload, and audit conventions.
- [ ] Plan OpenAPI generation and DTO-to-domain mapping.

### Epic F — Authentication and authorization

- [ ] Build sign-in/session bootstrap using a mock identity.
- [ ] Define roles, capabilities, route guards, and action guards.
- [ ] Implement timeout warning, sign-out, kiosk reset, and unauthorized handling.
- [ ] Confirm production token/cookie strategy and re-authentication rules.
- [ ] Test that sensitive data is cleared between kiosk users.

### Epic G — Patient kiosk check-in

- [ ] Welcome, branding, and language selection.
- [ ] Appointment identity lookup and confirmation.
- [ ] Demographic/contact review.
- [ ] Dynamic intake forms and validation.
- [ ] Consent version display, acknowledgement, and signature.
- [ ] Mock document/photo upload.
- [ ] Review, submit, success, timeout, reset, and staff-help flows.
- [ ] Happy path, no appointment, duplicate, invalid data, offline/failure, and resume tests.

### Epic H — Clinic operations

- [ ] Today/upcoming schedule with provider/location filters.
- [ ] Patient and appointment search.
- [ ] Status workflow and timestamps.
- [ ] Form/consent completion indicators and review.
- [ ] Staff-assisted check-in and exception resolution.
- [ ] Responsive tablet and desktop layouts.

### Epic I — Checkout

- [ ] Service/product cart and edit rules.
- [ ] Packages, memberships, credits, discounts, tax, tips, and totals.
- [ ] Mock full/split payment, decline/retry, void/refund, and permissions.
- [ ] Receipt preview plus mock print/email/SMS.
- [ ] Follow-up booking and visit completion.
- [ ] Decimal-safe calculation and business-rule tests.

### Epic J — Internationalization

- [ ] Configure namespaces, fallbacks, and locale persistence.
- [ ] Externalize UI and validation strings.
- [ ] Implement date/time/number/currency formatting.
- [ ] Add pseudo-locale and missing-key CI checks.
- [ ] Select and translate second EU locale.
- [ ] Complete linguistic and text-expansion QA.

### Epic K — Incremental migration

- [ ] Define mount/route integration API with legacy code.
- [ ] Isolate React CSS and DOM ownership.
- [ ] Bridge auth, location, navigation, and refresh events.
- [ ] Implement feature flags and cohort rollout.
- [ ] Pilot one route and compare workflow outcomes.
- [ ] Repeat migration checklist and remove legacy only after stability gate.

### Epic L — Production readiness

- [ ] Threat/privacy review and sensitive-data logging audit.
- [ ] WCAG 2.1 AAA criterion-by-criterion manual and automated assessment, documented in an accessibility conformance report.
- [ ] Performance/load assessment and bundle budgets.
- [ ] Cross-browser and real-device matrix completion.
- [ ] Monitoring dashboards, alerts, runbooks, support training, rollback drill, and disaster/recovery assumptions.
- [ ] User acceptance testing and staged clinic rollout.

## 6. Definition of Done for Every Feature

- Product acceptance criteria and edge cases are documented.
- Tablet and desktop behavior is designed and implemented where applicable.
- Loading, empty, error, unauthorized, offline/interrupted, and stale-data states are handled.
- User-visible text is localized and tested for expansion.
- Keyboard, focus, semantic markup, touch target, AAA contrast, zoom, screen-reader, voice-control, timing, cognitive clarity, and applicable media alternatives are reviewed against WCAG 2.1 AAA.
- Domain logic and adapters have unit tests; workflows have integration/E2E coverage proportional to risk.
- No sensitive data is exposed in URLs, logs, analytics, fixtures, or persistent storage.
- Telemetry measures success/failure without patient data.
- Documentation, feature flag, rollout, rollback, and support notes are updated.
- Backend contract assumptions and unresolved decisions are recorded.

## 7. Testing Matrix

| Layer | Focus | Example |
| --- | --- | --- |
| Static | Types, lint, translations | Invalid DTO, forbidden dependency, missing key |
| Unit | Pure business logic | Totals, status transitions, schema rules |
| Component | Rendering and interaction | Form errors, focus, dialogs, localized text |
| Integration | Feature plus repository | Check-in submission and retry |
| End-to-end | Critical user journeys | Arrival through checkout and kiosk reset |
| Accessibility | Automated and manual | axe, keyboard, screen reader, zoom |
| Visual | Responsive regression | Tablet portrait/landscape and desktop |
| Operational | Release behavior | flags, telemetry, timeout, rollback |

## 8. Release Approach

1. Develop behind feature flags with synthetic data.
2. Integrate development APIs through the HTTP adapter.
3. Validate contracts and run automated tests in CI.
4. Deploy to staging with production-like identity and peripherals.
5. Conduct clinic UAT and accessibility/security checks.
6. Pilot with internal staff or one clinic/location.
7. Expand cohorts while watching workflow, error, and support metrics.
8. Close rollback window and retire the replaced legacy slice.

## 9. Major Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Unknown legacy coupling | Inventory globals/plugins and start with route-level slices |
| React and Bootstrap CSS collisions | Scoped tokens/styles, dedicated roots, visual regression tests |
| Mock contracts diverge from backend | Repository boundary, contract log, early OpenAPI review, contract tests |
| Clinic disruption | Feature flags, cohort rollout, tested rollback, retain legacy route initially |
| Tablet/peripheral incompatibility | Confirm hardware in Week 1 and test real devices continuously |
| Scope expands into full practice management | Lock P0 workflows and prioritize P1 modules explicitly |
| Sensitive patient data leakage | Synthetic fixtures, logging/analytics review, cache/session clearing |
| Accessibility added too late | Accessible primitives and checks from the first vertical slice |
| Translation causes redesign | Externalize early, pseudo-localize, support text expansion |
| Financial calculation errors | Decimal-safe representation, centralized rules, exhaustive tests, backend authority |

## 10. Suggested Team Cadence and Ownership

- Weekly product/clinic workflow review.
- Twice-weekly frontend/backend contract sync during active integration.
- Design-system and accessibility review for new patterns before broad reuse.
- Demo each vertical slice on actual tablet and desktop sizes.
- Maintain ADRs, migration matrix, contract decision log, risks, and release checklist in the repository.
- Require product, QA, accessibility, security/privacy, backend, and clinic-operation approval at the relevant release gates.

## 11. First Implementation Slice After Approval

Build a walking skeleton that includes:

1. Responsive kiosk welcome screen with English and a pseudo/second locale.
2. Mock session and appointment lookup.
3. Appointment confirmation form with schema validation.
4. Mock submission with latency, success, validation failure, and network failure.
5. Success screen and verified patient-session cleanup.
6. A minimal staff desktop route showing the submitted arrival.
7. Tests for responsive layout, keyboard/focus behavior, localization, adapter behavior, and the end-to-end path.

This slice validates the architecture and the highest-risk integration boundaries before the remainder of the check-in workflow is built.
