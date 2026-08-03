# Med Spa Practice Management Frontend Requirements

## 1. Purpose

Build and incrementally roll out a modern React + TypeScript frontend for a Med Spa Practice Management Platform while the existing jQuery 2 + Bootstrap 3 application remains operational.

The first release must support fast, reliable in-clinic check-in and checkout on tablets. The commercial release must also provide a complete desktop experience, responsive layouts, localization, accessibility, and a safe path for migrating legacy screens one component at a time.

Until real ASP.NET Core API contracts are available, all server interactions will use typed local JSON fixtures and a replaceable mock API layer.

## 2. Goals

- Complete the tablet check-in/checkout experience for internal clinic launch.
- Establish a production-ready React and TypeScript foundation.
- Support tablet and desktop from one responsive application.
- Allow React and the legacy application to coexist during migration.
- Support English and a configurable second EU language without redesigning screens.
- Deliver an accessible, consistent UI suitable for commercial customers.
- Keep business logic, API access, and presentation separated so mock JSON can be replaced by real APIs with minimal UI changes.

## 3. Non-goals for the Initial Build

- Implementing or changing ASP.NET Core APIs.
- Replacing every legacy administration screen in the first release.
- Building native iOS or Android applications.
- Processing real card payments in the mock phase.
- Providing clinical diagnosis or treatment recommendations.
- Storing real patient health or payment data in fixtures, logs, analytics, or browser storage.

## 4. Users and Roles

| Role | Primary device | Main needs |
| --- | --- | --- |
| Patient/guest | Clinic tablet | Identify appointment, complete forms, consent, check in, review and sign checkout documents |
| Front desk | Desktop/tablet | Find patients, manage arrivals, verify forms, take payment, book follow-up, resolve exceptions |
| Provider | Tablet/desktop | View schedule and visit status, review relevant forms, hand off to checkout |
| Clinic manager | Desktop | Monitor clinic flow, configure basic clinic UI settings, review operational status |
| Administrator | Desktop | Manage users, roles, locations, services, translations, and system configuration |

All routes and actions must be protected by role and permission, with the server remaining the final authorization authority when real APIs are connected.

## 5. Product Modes

### 5.1 Kiosk/tablet mode

- Touch-first interface with large targets and minimal text entry.
- Optional full-screen route with clinic branding and no administrative navigation.
- Explicit session start and end; automatically clear patient context after completion, cancellation, or inactivity.
- Privacy screen between patients and no sensitive data left visible in browser history.
- Landscape is the primary layout; portrait remains usable.
- Provide staff-assisted escape/recovery without exposing administrative functions to patients.

### 5.2 Staff tablet mode

- Responsive navigation and compact operational views.
- Schedule, patient lookup, arrival status, form review, checkout, and exception handling.
- Support touch and hardware keyboard/barcode input where available.

### 5.3 Desktop mode

- Persistent application navigation, denser tables, filtering, sorting, and split-detail layouts.
- Efficient keyboard operation for front-desk users.
- Wider dashboards without simply stretching tablet cards.

Recommended breakpoints are design-token driven, approximately: mobile below 768 px, tablet 768–1199 px, and desktop 1200 px and above. Features must not depend on device detection alone.

## 6. Required Workflows and Screens

### 6.1 Shared application foundation (P0)

- Application shell, clinic/location context, navigation, route guards, loading states, empty states, error boundaries, notifications, and confirmation dialogs.
- Sign-in, sign-out, session timeout warning, unauthorized, offline, and unexpected-error screens.
- Current user/profile and language selection.
- Theme and design-token baseline for color, typography, spacing, radius, elevation, focus, and motion.

### 6.2 Patient kiosk check-in (P0)

1. Welcome and language selection.
2. Appointment lookup using a privacy-conscious identifier (for example phone plus date of birth or a staff-issued code).
3. Appointment confirmation or staff-help path.
4. Demographic and contact verification.
5. Medical history/intake forms with required-field validation.
6. Consent and policy acknowledgement, including signature capture where required.
7. Optional document/photo/insurance capture represented by mock upload responses.
8. Review and submit.
9. Success screen with clear handoff instructions, then automatic session reset.

The workflow must support saving progress through the mock repository, returning to prior steps, server-style validation errors, duplicate submission prevention, and a staff-assisted exception path.

### 6.3 Staff clinic flow (P0)

- Today/upcoming schedule by provider and location.
- Patient and appointment search.
- Status flow: scheduled, arrived, forms incomplete, ready, in treatment, ready for checkout, completed, cancelled, and no-show.
- Patient summary with minimum necessary information.
- Outstanding form/consent indicators and review.
- Manual check-in and status updates.
- Clear timestamps and responsible staff member in operational history.

### 6.4 Checkout (P0)

1. Review services and products.
2. Apply authorized discount/package/membership/credit using mock rules.
3. Calculate subtotal, tax, gratuity where permitted, balance, and amount due.
4. Select mock payment method and simulate success, decline, retry, split payment, and refund/void permissions.
5. Generate a mock receipt and offer print/email/SMS actions.
6. Schedule or recommend a follow-up without clinical decision logic.
7. Complete visit and clear patient context.

Currency, tax labels, date, time, and number formats must be locale-aware. Monetary values must use integer minor units or a decimal-safe representation, never binary floating-point arithmetic.

### 6.5 Commercial desktop modules (P1 unless promoted)

- Dashboard and clinic-flow overview.
- Calendar/schedule management.
- Patient list and patient profile.
- Appointment creation and editing.
- Forms and consent management.
- Checkout, invoices, payments, memberships/packages, and retail products.
- Basic reporting surfaces using mock data.
- Staff, role, location, service, and application settings.
- Translation/content configuration where appropriate.

Detailed business rules for these modules require product and backend confirmation before implementation.

## 7. Functional Requirements

### 7.1 State and data

- Server state must be fetched and cached through a dedicated query layer.
- Short-lived UI state stays local; cross-route session state uses a small explicit store.
- Forms use schema-based validation shared between fixtures, UI validation, and API adapters where practical.
- Every collection supports defined loading, empty, error, refresh, and pagination behavior.
- Mutations that affect patient or financial state require feedback, duplicate-click protection, and safe retry rules.
- Optimistic updates are allowed only when reversal and conflict behavior are clear.

### 7.2 Mock JSON API

- UI components must never import fixture JSON directly.
- Define TypeScript domain models and repository/service interfaces.
- A mock adapter reads JSON fixtures, adds configurable latency, and can return success and known error scenarios.
- A future HTTP adapter must implement the same interfaces.
- Mock fixtures must be synthetic and contain no real patient data.
- Provide fixtures for happy paths, empty states, incomplete records, validation failures, unauthorized access, network failure, payment decline, and concurrent/stale updates.
- Proposed resources: sessions, users, clinics, locations, providers, patients, appointments, intake forms, consents, visits, services, products, carts, invoices, payments, receipts, and translations.
- API payload assumptions must be tracked in an API contract decision log and reviewed with the .NET team.

### 7.3 Internationalization

- Use `react-i18next` or an equivalent namespace-based solution.
- English is the source locale; select the second locale with product stakeholders before translation begins.
- No user-visible string may be hard-coded in a component.
- Support interpolation, plurals, locale-aware dates/numbers/currency, validation messages, and fallback text.
- Layouts must tolerate text expansion and avoid fixed text containers.
- Translation resources load by feature; missing keys are reported in development and tests.
- Prepare for right-to-left layout at the token/component level even if the first two locales are left-to-right.

### 7.4 Accessibility — WCAG 2.1 Level AAA

- All new React UI must conform to WCAG 2.1 Level AAA. Automated tools support detection, but release conformance requires a criterion-by-criterion manual audit and an accessibility conformance report.
- Full keyboard navigation, visible focus, logical focus order, skip links, and focus management after route/dialog changes.
- Semantic landmarks, headings, labels, instructions, and accessible validation summaries.
- Minimum touch target of 44 by 44 CSS pixels.
- Normal text must meet 7:1 contrast and large text must meet 4.5:1 contrast. UI components and graphical objects must meet at least 3:1; status is never communicated by color alone.
- Provide sign-language interpretation, extended audio description, accessible media alternatives, pronunciation/abbreviation help, and simplified supplemental content whenever applicable media or complex content is introduced.
- Do not impose timing unless essential. Session security timeouts must warn users, permit extension, and provide an accessible staff-assisted recovery path.
- Screen-reader-compatible forms, dialogs, tables, signature alternatives, timeouts, and notifications.
- Respect reduced-motion and text zoom up to 200% without loss of function.

### 7.5 Responsive and resilience requirements

- Core check-in and checkout tasks must work at 768×1024, 1024×768, 1280×800, 1440×900, and common desktop widths.
- Mobile layouts should remain usable for staff workflows, though patient kiosk certification targets tablets.
- Avoid data loss on accidental navigation; warn when edits are unsaved.
- Display offline/interrupted-connection state. Do not promise offline submission until secure synchronization is separately designed.
- Use skeletons or progress indicators for meaningful waits; prevent layout shift in primary workflows.

### 7.6 Security and privacy

- Treat all patient and clinical data as sensitive.
- Do not place sensitive data in URLs, analytics events, console logs, error reports, fixture names, or unencrypted persistent browser storage.
- Clear kiosk data and cached sensitive queries at session end and timeout.
- Use secure, server-managed authentication when connected; avoid long-lived tokens in local storage.
- Mask sensitive identifiers where full display is unnecessary.
- Require re-authentication or appropriate permission for sensitive financial/administrative actions.
- Record audit-relevant actions through the future API; mock mode must visibly label simulated audit behavior.
- Complete a formal HIPAA/GDPR/security review before production; frontend controls alone do not provide compliance.

## 8. Technical Requirements

Recommended baseline, subject to an architecture decision record:

- React 19-compatible architecture with TypeScript in strict mode.
- Vite for an embedded/single-page incremental migration; choose Next.js only if server rendering or its routing/server features become a confirmed requirement.
- React Router for routes.
- TanStack Query for server state.
- React Hook Form plus Zod for form state and validation.
- `react-i18next` for localization.
- A headless accessible component foundation such as Radix/shadcn, styled through owned design tokens. Avoid coupling product behavior to a theme library.
- Vitest and React Testing Library for unit/integration tests; Playwright for critical user journeys.
- ESLint, Prettier, type checking, and automated accessibility checks in CI.
- Feature-oriented directories with dependency boundaries between app shell, features, shared UI, domain models, and data adapters.

## 9. Legacy Coexistence Requirements

- Use a strangler migration: route or mount selected areas in React while untouched screens continue in jQuery/Bootstrap.
- Prefer route-level ownership. Where embedded components are necessary, mount React into dedicated DOM roots with explicit props and lifecycle cleanup.
- Prevent CSS leakage using scoped React styles/tokens and a compatibility layer; do not globally replace Bootstrap styles during coexistence.
- Define one-way integration contracts for authentication context, clinic/location context, navigation, and refresh events.
- Do not let jQuery mutate DOM owned by React or React mutate legacy-owned DOM.
- Add telemetry and a rollback mechanism/feature flag for each migrated feature.
- Remove legacy code only after equivalent behavior is accepted and production metrics are stable.

## 10. Quality Requirements

- TypeScript compilation and linting pass with no new warnings.
- Unit tests cover business calculations, validation, adapters, and state transitions.
- Integration tests cover forms and error/retry behavior.
- End-to-end tests cover kiosk check-in, staff-assisted check-in, successful checkout, declined payment recovery, localization, session timeout, and role restrictions.
- Automated accessibility checks run on representative screens; critical journeys receive manual keyboard, screen-reader, voice-control, cognitive-accessibility, contrast, reflow, and WCAG 2.1 AAA criterion review.
- Visual regression coverage for tablet landscape/portrait and desktop breakpoints.
- Define performance budgets after measuring the legacy baseline. Initial targets: responsive interaction, lazy-loaded feature routes, and no unnecessary loading of desktop administration code in kiosk mode.
- Test supported current versions of Chrome and Edge; confirm Safari/iPadOS requirements with clinic hardware inventory.

## 11. Observability and Operations

- Capture route-level errors, API failures, performance signals, and workflow completion/abandonment without sending sensitive fields.
- Use correlation IDs from the API when available.
- Provide environment configuration for local mock, development API, staging, and production.
- Show build/version information in an appropriate staff-accessible location.
- Provide feature flags for incremental rollout by clinic/location or user cohort.

## 12. Acceptance Criteria by Release

### Internal tablet launch

- A patient can complete the full check-in flow on supported clinic tablets using synthetic/mock API data.
- Front-desk staff can see arrival and form status, resolve exceptions, and complete a mock checkout.
- Kiosk session data clears on completion and timeout.
- Critical flows pass agreed browser, accessibility, and end-to-end checks.
- Operational runbook, known limitations, and support/rollback steps exist.

### React foundation

- CI enforces formatting, linting, strict type checking, tests, and production build.
- Design tokens, responsive shell, component primitives, routing, state/data patterns, i18n, error handling, and mock/HTTP adapter boundaries are documented and demonstrated.
- At least one real legacy feature slice can be mounted or routed to React behind a feature flag.

### Commercial rollout

- Approved P1 modules are migrated and accepted at feature parity or intentionally redesigned with documented approval.
- English plus the selected EU locale pass linguistic and functional review.
- New React surfaces have a completed WCAG 2.1 AAA conformance review with no open failures.
- Tablet and desktop workflows pass usability, security/privacy, performance, and production-readiness reviews.
- Rollout can be staged and rolled back without interrupting all clinics.

## 13. Decisions and Inputs Needed

Before implementation reaches production, stakeholders must confirm:

- Exact internal-launch workflows and what already exists in the legacy UI.
- Clinic tablet models, OS/browser versions, orientation, printers, scanners, signature devices, and payment terminals.
- Authentication/SSO, roles, permissions, session timeout, and kiosk identity model.
- Second EU language, countries, currencies, tax/tipping rules, and data residency/privacy obligations.
- Check-in identity verification and minor/guardian workflows.
- Required intake forms, consent versioning, signature legality, and retention rules.
- Payment provider, PCI boundary, split/tip/refund behavior, and receipt delivery.
- Real ASP.NET Core endpoint contracts, pagination/error conventions, concurrency tokens, audit requirements, and generated-client/OpenAPI strategy.
- Supported browsers, hosting/deployment topology, analytics/error-reporting vendors, and feature-flag service.
- Commercial P1 module priority and the definition of parity for each legacy screen.

## 14. Recommended Product and Engineering Principles

- Map real clinic workflows before redesigning them; speed and clarity at the front desk outrank decorative novelty.
- Build a thin vertical slice first: appointment lookup through completed check-in, including errors and telemetry.
- Keep the design system small initially and grow it from actual workflows.
- Treat kiosk mode as a privacy-sensitive session, not merely a responsive breakpoint.
- Use OpenAPI-generated types when contracts stabilize, but keep domain mapping at the frontend boundary.
- Measure task completion time, error rate, abandonment, support incidents, and accessibility defects per release.
- Maintain a migration inventory showing each legacy screen's owner, dependencies, parity criteria, rollout status, and deletion date.
