# TASK-011 — Bounded patient browsing, workflow navigation, and frontend request safety

Status: Complete

## Purpose

Keep the 10,000-record patient directory responsive on older tablets while making patient-to-schedule workflows direct and ensuring frontend network/storage behavior does not create avoidable security risk.

## Scope and checklist

- [x] Limit infinite-scroll patient cards in the live DOM to four 24-record pages (maximum 96 cards).
- [x] Prefetch the previous and next page for pagination mode and retain pages in TanStack Query's bounded in-memory cache.
- [x] Include every filter, sort, page, and loading mode dimension in query keys so cached results cannot appear under the wrong search.
- [x] Persist only the non-sensitive pagination/infinite-scroll preference in `localStorage` under a versioned key.
- [x] Keep patient records, selected-patient data, auth credentials, and clinical context out of local/session storage.
- [x] Add patient detail, quick-schedule, and filtered full-schedule navigation.
- [x] Add a reusable JSON request boundary with allowed-origin checks, HTTPS downgrade blocking, timeout/abort, same-origin credentials, redirect rejection, status/content-type checks, and Zod response validation.
- [x] Add unit/integration and Playwright coverage for bounded DOM size, cache isolation, stored preference, detail navigation, and quick scheduling.
- [x] Update architecture/security documentation and README operational guidance.
- [x] Pass typecheck, lint, at least 80% coverage, build, and the complete multi-device Playwright suite.
- [x] Commit and push the completed task to GitHub.

## Data and cache rules

- Page size: 24 records.
- Infinite-scroll live window: maximum four pages / 96 patient cards.
- Pagination prefetch: current page ±1 when valid.
- Cache location: TanStack Query memory only for patient data; no durable clinical-data cache.
- Cache identity: normalized search + membership + balance + visit + sort + mode + page.
- Filter changes start from page zero and resolve through a distinct cache key.
- Mock JSON remains the current repository implementation; the API adapter will use the same typed contract later.

## Security ownership

Frontend responsibilities implemented here:

- refuse unapproved API origins and HTTPS-to-HTTP downgrade requests;
- use timeouts/abort signals and reject redirects;
- request JSON and validate response shape;
- avoid durable storage of patient/clinical data and tokens;
- use versioned, enumerated storage keys for non-sensitive preferences.

Backend/infrastructure responsibilities (documented, not falsely implemented in React):

- authentication, authorization, tenant/record ownership, and object-level access control;
- secure `HttpOnly`, `Secure`, `SameSite` session cookies and CSRF validation;
- API keys, signing/encryption secrets, audit logging, throttling, and replay protection;
- CORS allowlist and security response headers such as HSTS and CSP;
- server-side request validation and output encoding policy.

No secret or API key will be added to Vite variables, JavaScript bundles, local storage, session storage, or source control.

## Acceptance criteria

1. Infinite scroll never renders more than 96 `.patient-profile-card` elements.
2. Pagination preloads adjacent pages and navigating back/forward does not show a mismatched filter result.
3. A user can open a patient profile, quick-schedule that patient, and see the Schedule search prefilled.
4. Reloading remembers only the browsing-mode preference; patient details are not present in Web Storage.
5. Unsafe origin, insecure downgrade, invalid JSON content type, non-success status, and invalid schema responses are rejected.
6. Automated quality gates pass with coverage at or above 80%.

## Implementation notes

The task record was formalized before continuing implementation and will be updated with final evidence before commit.

## Verification evidence

- TypeScript: passed.
- ESLint with zero warnings: passed.
- Vitest: 39/39 tests passed.
- Coverage: 98.70% statements/lines, 92.30% branches, 89.24% functions.
- Vite modern and legacy production bundles: passed.
- Playwright: 64/64 tests passed across tablet landscape/portrait, iPad Air, iPad Pro, Android tablet, large tablet, desktop, and throttled low-power tablet.
