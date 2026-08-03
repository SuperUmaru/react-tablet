# Code Review — 2026-08-03

## Summary

The repository is a sound walking skeleton: strict TypeScript, clear mock repository boundary, responsive tablet/desktop layouts, localization infrastructure, high unit/integration coverage, and clean production dependencies. It is not yet production-ready clinical software. The highest-value next work is resilience/privacy in kiosk sessions, complete localization, deterministic mock isolation, and browser-level tablet validation.

## Findings

### High priority

1. **Kiosk session lifecycle is incomplete.** Manual reset exists, but inactivity timeout, warning/extension, route-exit cleanup, reload behavior, and staff recovery are not implemented. Patient context could remain visible when a user walks away.
   - Recommendation: create an explicit check-in state machine and privacy session controller; warn before timeout, allow extension per WCAG timing requirements, and clear all sensitive query/form state on timeout, completion, route exit, and logout.

2. **Network exceptions are not handled in the UI.** `lookup` and `confirm` use `await` without `try/finally`; a rejected repository promise can leave the UI busy and produce an unhandled error.
   - Recommendation: centralize mutation state through TanStack Query or a typed async state helper; show localized retry messaging and always reset busy state in `finally`.

3. **WCAG 2.1 AAA is a target, not yet demonstrated conformance.** Semantic foundations are useful, but no automated browser scan or manual conformance report previously existed. AAA also includes criteria automation cannot verify.
   - Implemented in this task: Playwright + axe A/AA detection and artifact collection.
   - Recommendation: complete the manual AAA matrix described in `TASK-005`, including readability, timing, cognitive support, pronunciation, media, keyboard, screen reader, voice control, zoom/reflow, and contrast measurements.

### Medium priority

4. **Many user-visible strings bypass i18n.** Examples include skip links, location, settings/search labels, dates, loading text, appointment confirmation labels, busy text, demo hint, privacy footer, and patient-specific confirmation sentence.
   - Recommendation: move every string to feature namespaces and add a test/ESLint rule that rejects raw JSX text outside approved components.

5. **The singleton mock repository is mutable across tests and browser sessions.** `markArrived` changes module state. This can make order-dependent tests and prevents deterministic scenario setup.
   - Recommendation: create repositories per app/test context, add reset/seed/scenario APIs only in the mock adapter, and use Playwright fixtures to select scenarios.

6. **Routing is intentionally minimal.** Every unknown URL displays the dashboard, so invalid links are hidden rather than reported. Native full-page navigation also loses app state.
   - Recommendation: adopt a security-reviewed router when more routes are added, define a real not-found page, route metadata, lazy boundaries, and authorization guards.

7. **Static operational content can become incorrect.** The date, schedule summary, location, staff user, counts, year, and timezone assumptions are hard-coded.
   - Recommendation: add clock, current-user, clinic, and location abstractions; calculate summaries from repository data; freeze the clock in automation.

8. **Dashboard async behavior is incomplete.** Loading exists, but error, empty, stale, refresh, and retry states do not.
   - Recommendation: implement a shared async-content pattern with localized recovery controls.

9. **Table semantics are simulated with generic `div` roles.** Cells/column headers do not have complete table roles, and the tablet CSS hides a visual provider column without explicitly addressing its accessibility behavior.
   - Recommendation: use a native table for desktop or complete the ARIA grid/table structure; use a separate semantic card/list presentation at tablet widths.

### Lower priority / maintainability

10. **`CheckInPage` and `DashboardPage` contain dense one-line JSX.** This increases review cost and makes accessibility changes harder.
    - Recommendation: extract feature components (`AppointmentLookupForm`, `AppointmentConfirmation`, `ScheduleTable`, `DailyStats`) after behavior stabilizes; avoid premature generic abstractions.

11. **External Google Fonts were imported from CSS.** The low-power Playwright profile measured a 15-second ready time under constrained networking.
    - Resolved in TASK-006: replaced the runtime request with system font stacks; self-host approved brand fonts later if necessary.

12. **No error boundary or privacy-safe telemetry implementation exists.** Requirements mention both, but the walking skeleton does not implement them.
    - Recommendation: add route/feature error boundaries and a typed telemetry interface that explicitly rejects sensitive fields.

13. **Zod is installed but not used.** Native form constraints cover the demo only.
    - Recommendation: either apply Zod to DTO/fixture parsing and check-in form schemas or remove it until the first validated contract is implemented.

## Improvements completed during this review

- Removed an accidental production dependency named `git`.
- Added Playwright projects for tablet landscape, tablet portrait, and desktop Chromium.
- Added patient check-in, recovery, session-reset, navigation, overflow, and axe accessibility browser tests.
- Added HTML/JSON reporting plus screenshots, video, traces, and axe JSON artifacts.
- Added Playwright execution to GitHub Actions with 14-day artifact retention.
- Added a dual modern/legacy Vite build, old-browser-safe mock cloning, CSS fallbacks, and a throttled low-power tablet performance profile.

## Recommended execution order

1. Kiosk privacy/session controller and network recovery.
2. Finish i18n extraction and deterministic mock scenarios.
3. Resolve all Playwright/axe findings and create the manual AAA matrix.
4. Add semantic tablet schedule cards and desktop table.
5. Add API/clock/identity adapters and error boundaries.
6. Expand check-in to demographics, intake, consent, review, and timeout recovery.
