# TASK-015 — Centralized frontend observability and restrained multilingual toasts

Status: Completed

## Purpose

Make production failures diagnosable without asking customers to reproduce them, while protecting patient data and giving users concise multilingual confirmation for meaningful completed actions.

## Checklist

- [x] Define a provider-neutral telemetry envelope and adapter boundary.
- [x] Capture React render crashes, global errors, unhandled promise rejections, HTTP 403, and HTTP 5xx.
- [x] Add correlation/session IDs and a bounded sanitized behavior breadcrumb trail.
- [x] Redact query strings, form values, patient names/identifiers, tokens, request/response bodies, and clinical/payment data.
- [x] Send critical telemetry to a same-origin ingestion endpoint suitable for Azure Application Insights or AWS CloudWatch forwarding.
- [x] Keep normal/recoverable issues local and show clear user-facing errors without central critical alerts.
- [x] Add an accessible toast provider with polite live-region behavior, deduplication, bounded queue, and automatic dismissal.
- [x] Add translated English/Spanish success and error messages for meaningful actions.
- [x] Avoid success-toast fatigue: notify only after asynchronous mutations or important workflow completion.
- [x] Document Azure/AWS integration, sampling, retention, alerting, privacy, and source-map requirements.
- [x] Add unit/integration coverage and verify the complete Playwright device matrix.
- [x] Pass typecheck, lint, ≥80% coverage, production build, and full device E2E.
- [x] Commit and push TASK-015 to GitHub.

## Severity and UX policy

| Event | Central telemetry | User experience |
| --- | --- | --- |
| React render crash / uncaught error / unhandled rejection | Critical | Stable recovery screen with trace ID |
| HTTP 500–599 | Error/critical | Clear retry message with trace ID |
| HTTP 403 | Warning/security signal | Access-denied message; no automatic retry |
| HTTP 400/404/409/412 expected domain response | Normal diagnostic only when explicitly needed | Inline or toast guidance; preserve user work |
| Successful read/navigation | None | No toast |
| Successful save/payment/check-in | Lightweight event where useful | One concise translated toast |

## Privacy rules

- Breadcrumbs contain allowlisted action names and route templates only.
- Never record input values, visible text, patient IDs/names, email/phone, appointment/payment details, DOM snapshots, full URLs, query strings, headers, cookies, tokens, or request/response bodies.
- Session and correlation IDs are random operational identifiers, not user or patient identifiers.
- Source maps are uploaded privately during deployment and are not publicly served.
- Provider retention, access roles, geographic region, and sampling require security/privacy approval.

## Architecture decision

The browser sends sanitized envelopes to a same-origin `/api/telemetry/client-errors` contract. ASP.NET Core owns authentication, tenant-safe enrichment, throttling, validation, and forwarding to Azure Application Insights, AWS CloudWatch, or another provider. This avoids cloud write credentials and provider lock-in inside the public JavaScript bundle.

## Acceptance criteria

1. A simulated React crash creates one redacted critical envelope and displays a recovery reference ID.
2. HTTP 403 and 5xx produce classified telemetry without request/response payload data.
3. Breadcrumb history is bounded, contains only allowlisted action metadata, and cannot collect form values.
4. Save/payment produces one accessible translated toast; check-in retains its dedicated completion screen to avoid duplicate notices; ordinary navigation does not.
5. Toasts deduplicate, remain keyboard/screen-reader safe, and respect reduced motion.
6. Automated quality and device checks pass.

## Verification

- TypeScript and ESLint: passed.
- Vitest: 46/46 passed; 94.31% statements/lines, 88.67% branches, 84.44% functions.
- Production build: passed.
- Playwright: 82/82 passed across tablet, desktop, visual, accessibility, workflow, and low-power projects.
