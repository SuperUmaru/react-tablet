# Deep code review — 2026-08-03

Scope: all application source, tests, build configuration, CI, security/concurrency/observability boundaries, tablet performance, accessibility, and documentation. This review records findings only; application fixes require follow-up tasks.

## Executive assessment

The foundation is modern and appropriate: strict TypeScript, route-level code splitting, TanStack Query/Router, repository boundaries, Zod validation, bounded patient rendering, device-focused Playwright coverage, and explicit frontend/backend security ownership. The current application is a strong synthetic-data prototype, not yet a production clinical release.

The highest-risk gaps are telemetry identifier redaction, lost crash stack context, incomplete async failure recovery, incomplete localization, and concurrency helpers that are documented but not connected to real mutations.

## Findings

### P0 — Privacy boundary

1. **Generated patient IDs can enter telemetry routes.** `routeTemplate` recognizes numeric, UUID, and `pat-*` segments, but the 10k dataset generates `patient-*`. A crash on `/patients/patient-00025` can therefore send that identifier. Replace pattern-based redaction with route-aware templates or redact every dynamic segment through the router match before enabling production ingestion.

### P1 — Release blockers

2. **The React error boundary discards the original error stack.** It constructs a new error from the error name and component stack; the sanitizer then removes that message line. Telemetry points at the boundary instead of the failing source. Preserve a sanitized original stack and carry a separately sanitized component stack.

3. **Check-in async errors have no `try/finally`.** A rejected lookup or check-in request can leave the kiosk busy and produce an unhandled rejection instead of a recoverable translated message. Mutation/error states should preserve input and always clear busy state.

4. **Localization is partial.** Navigation and much of check-in are translated, but staff headings, forms, statuses, patient fields, checkout, settings, loading states, and several kiosk strings remain hardcoded English. Do not describe the full product as multilingual until all user-facing strings are resource keys and locale formatting covers dates/currency.

5. **Navigation bypasses TanStack Router.** `AppShell` uses plain `<a>` elements and reads `window.location.pathname`, causing full document reloads and discarding useful in-memory query state. Use typed router links and router location state.

6. **Optimistic concurrency is not integrated.** `If-Match` helpers and `409/412` handling exist, but current settings/payment mutations do not carry versions or present a conflict-resolution UI. The backend must enforce row versions, and every editable production resource needs an explicit stale-edit flow.

7. **HTTP cancellation/header composition is incomplete.** `safeJsonRequest` replaces any caller signal with its timeout signal, and spreading `Headers` is not a reliable merge. Compose abort signals and normalize with `new Headers(init.headers)` before adding defaults.

8. **Custom async telemetry transports can reject unhandled.** The synchronous `try/catch` around `void this.transport(...)` cannot catch a rejected promise. Normalize with `Promise.resolve(...).catch(...)` and add recursion/rate protection.

### P2 — Important improvements

9. **Several visible controls are placeholders.** “Add patient” has no action, and the logout icon links to Settings. Hide unfinished actions, label them as demos, or implement them before commercial usability testing.

10. **Central HTTP failures do not automatically produce user guidance.** The safe HTTP layer creates a trace ID for 403/5xx, but no shared mapping displays access-denied/retry copy with that reference. Real adapters need a consistent error-to-UI policy.

11. **Infinite-scroll DOM is bounded, but prefetched page cache can still grow.** Infinite query pages cap at four, while canonical per-page prefetch entries use the QueryClient cache lifetime. Apply an explicit short `gcTime`, cap/removal policy, or cursor-window cache for long sessions.

12. **Mock search repeatedly scans and sorts all 10,000 records.** This is acceptable for a JSON demonstration but does not represent production performance. Backend search needs indexed fields, stable cursor ordering, maximum page size, cancellation, and measured latency budgets.

13. **Toast timers are not owned or cleaned up.** Duplicate notifications schedule extra timers and timers survive provider unmount. Track one timer per toast and clear it on dismissal/unmount.

14. **Critical observability paths need stronger tests.** Add tests for React fallback recovery, global listeners, 403/5xx envelopes, async transport rejection, identifier redaction, Spanish notifications, and telemetry deduplication/rate limits.

15. **Automated accessibility coverage is A/AA, not AAA.** The axe configuration intentionally checks WCAG 2.0/2.1 A and AA tags. AAA requires contrast verification, screen-reader/keyboard/zoom/voice/timing review, cognitive clarity checks, and physical-device sign-off.

16. **Styles are concentrated in one large global file.** The growing stylesheet increases regression and legacy-coexistence risk. Split shell/workflow/component styles or adopt scoped CSS modules while keeping shared design tokens.

17. **Clinical currency/time context is not fully modeled.** Money formatting defaults and mixed hardcoded clinic text should derive from loaded clinic configuration, and all times must continue using the clinic timezone rather than device timezone.

## Strengths to preserve

- Route-level lazy bundles and typed search/parameter validation.
- Repository/domain boundaries that allow mock-to-HTTP replacement.
- Maximum 96 live patient cards, 24-record pages, early prefetch, debounce, and single-flight intersection gating.
- Minimal Web Storage allowlist and explicit backend security ownership.
- Deterministic clinic-time formatting and CI timezone configuration.
- Broad portrait/landscape screenshot matrix and low-power browser budget.
- 80% coverage gates, strict lint/type checks, and Playwright failure artifacts.
- Provider-neutral telemetry envelope and restrained accessible toast UX.

## Recommended order

1. Fix telemetry redaction and crash fidelity.
2. Add resilient async/error handling and tests.
3. Integrate real HTTP adapters plus ETag conflict UX.
4. Complete i18n and remove misleading placeholder controls.
5. Finish manual WCAG 2.1 AAA and physical-device certification.
6. Bound long-session query cache, modularize styles, and establish production performance budgets.
