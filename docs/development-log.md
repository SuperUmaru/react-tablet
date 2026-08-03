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

## 2026-08-03 — GitHub publishing

- Initialized the repository on `main` and created task-referenced commits for governance, the React application, and quality controls.
- Connected `origin` to `https://github.com/SuperUmaru/react-tablet.git` and pushed `main` successfully.
- Local commit identity is `Codex <codex@local>` because no repository author identity was configured; future commits should use the project owner’s verified GitHub email if contribution attribution is required.

## 2026-08-03 — Tablet automation and compatibility review

- Reviewed the complete walking skeleton and recorded prioritized findings in `docs/code-review-2026-08-03.md`.
- Added Playwright projects for 1024×768 touch landscape, 768×1024 touch portrait, 1440×900 desktop, and a throttled low-power tablet.
- Added critical patient/staff journeys, overflow assertions, axe scans, screenshots, JSON/HTML reports, traces, and failure video.
- The initial axe run found invalid table roles and insufficient contrast. Fixed both; all 12 landscape/portrait tests then passed.
- Added Vite’s official legacy build targeting iOS 12+ and Chrome/WebView 70+, removed unsupported `structuredClone`, and added CSS compatibility fallbacks.
- The initial low-power measurement exposed an invalid dev-server performance method and a runtime font dependency. Removed Google Fonts and changed Playwright to measure production bundles. The unchanged throttled performance gate then passed.
- Removed an accidental `git` npm production dependency; dependency audit remains clean.

## 2026-08-03 — Staff practice modules

- Replaced placeholder staff navigation with working Overview, Schedule, Patients, Checkout, and Settings routes.
- Redesigned Overview as a Med Spa clinic-flow command center instead of generic statistic cards.
- Added typed synthetic patient, checkout, and settings JSON behind `PracticeRepository`.
- Added working schedule/provider search, patient search, simulated payment completion, and settings persistence.
- Verified 28/28 unit/integration tests and coverage of 100% statements/lines, 95.42% branches, and 88.52% functions.
- Verified modern/legacy production build and 22/22 Playwright tests across tablet, desktop, accessibility, and low-power projects.

## 2026-08-03 — Schedule and typography correction

- Replaced the misleading proportional schedule rail with timestamp-derived agenda groups. The 1:30 PM visit is now structurally and visually grouped under 1 PM.
- Replaced the inconsistent native provider dropdown arrow with a controlled accessible select and custom chevron.
- Corrected patient avatar flex sizing, raised large avatars to 54 px, and added deterministic synthetic color treatments.
- Increased supporting typography across Overview, Schedule, Patients, Checkout, Settings, and kiosk surfaces from the prior 9–12 px range to a generally readable 12–16 px scale.
- Fixed clinic metadata leaking into the compact tablet sidebar and added Playwright screenshot attachments for schedule and patient-avatar review.

## 2026-08-03 — Navigation, avatar, and visual audit correction

- Replaced the generic Patients group glyph with a single-patient profile icon.
- Centered every compact tablet navigation icon and positioned the Checkout unread-count badge as an overlay so it cannot displace the icon.
- Fixed the patient fallback-avatar selector that clipped initials instead of centering them.
- Replaced native Settings select arrows with one consistent high-contrast chevron.
- Added a reusable Playwright visual-audit suite that captures every page in tablet landscape, tablet portrait, and desktop modes and checks horizontal overflow.
- Verified 18/18 full-page visual-audit cases and 3/3 focused Patients captures.

## 2026-08-03 — Large patient directory and device matrix

- Added a deterministic 10,000-patient JSON-style dataset with typed 24-record page responses and server-style name/email search.
- Added user-selectable pagination and infinite-scroll modes; pagination is the old-device-friendly default.
- Debounced search by 250 ms and kept rendering bounded to the fetched page(s).
- Prevented partial patient cards with zero-minimum grid tracks, card width containment, and a two-column iPad Air/Pro landscape breakpoint.
- Added iPad Air, iPad Pro, Android tablet, and large tablet Playwright profiles alongside legacy tablet, portrait tablet, and desktop.
- Captured all six pages across seven device profiles; 42/42 visual tests passed, including patient-card containment assertions.

## 2026-08-03 — React primitives and tablet patient controls

- Formalized Vite/TypeScript, TanStack Query/local state boundaries, Radix primitives, and semantic design-token conventions.
- Added an accessible Radix Select wrapper and migrated Settings and Patient filters to it.
- Added patient search by phone, membership/balance/next-visit filters, sorting, and reset behavior.
- Added compact landscape density and reduced-motion-aware entry/smooth-scroll behavior.
- Lazy-loaded Patients and Settings to isolate the Select dependency and preserve the initial bundle budget.
- Added an iPad Air/Pro assertion requiring exactly four or six fully visible cards in the initial viewport.

## Log Entry Template

### YYYY-MM-DD — Short title

- Work completed:
- Decisions:
- Verification:
- Known issues/blockers:
- Next task IDs:
