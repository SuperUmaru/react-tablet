# TASK-007 — Working Staff Practice Modules and Overview Refresh

## Why

The original walking skeleton only implemented Overview and patient check-in. Navigation placeholders did not support actual clinic work, and the dashboard resembled a generic administration template rather than a Med Spa operations surface.

## Completed

- Rebuilt Overview around clinic flow health, patient journey stages, attention items, daily signals, next visits, and a front-desk day note.
- Added shared staff application shell with working Overview, Schedule, Patients, Checkout, and Settings routes.
- Added Schedule search/provider filters and touch-friendly appointment board.
- Added patient search, membership/tag context, visit dates, and balances.
- Added checkout queue, itemized visit summary, integer-minor-unit totals, simulated payment, and completed receipt state.
- Added editable clinic identity, timezone/currency, kiosk timeout, consent, tips, and reminders settings with mock persistence.
- Added typed synthetic JSON fixtures and a replaceable `PracticeRepository` boundary.
- Added tablet/desktop responsive layouts for all modules.

## Synthetic resources

- `patients.json`
- `checkout.json`
- `settings.json`
- Existing `appointments.json`

No real patient or payment data is included.

## Verification

- TypeScript strict build: pass.
- ESLint: pass with zero warnings.
- Unit/integration tests: 28/28 pass.
- Coverage: 100% statements, 95.42% branches, 88.52% functions, 100% lines.
- Production modern + legacy build: pass.
- Playwright: 22/22 pass across tablet landscape, tablet portrait, desktop Chromium, and low-power tablet.
- Browser suite covers schedule search, patient search, mock payment, settings save, kiosk paths, overflow, axe scans, and throttled performance.

## Post-delivery UI corrections

- Agenda groups are derived from appointment timestamps rather than a decorative time rail.
- Provider select uses one consistent chevron and touch-sized control.
- Staff/kiosk supporting text uses a larger readability scale.
- Patient avatars have a fixed 54 px flex basis and deterministic fallback initials/colors.
- Compact sidebar icons share identical centered geometry; the Checkout count is an absolute status overlay.
- Settings selects use a controlled, consistently positioned chevron instead of browser-dependent arrows.
- `visual-audit.spec.ts` captures all six routes at the three supported tablet/desktop viewports.

## Follow-up

- Add create/edit dialogs and server-style validation for appointments and patients.
- Add checkout discounts, split tender, decline/retry, refund/void permissions, receipts, and audit events.
- Externalize remaining English staff strings into feature i18n namespaces.
- Replace native route selection with a security-reviewed router when the dependency advisory window closes.
- Connect HTTP adapters to confirmed ASP.NET Core/OpenAPI contracts.
