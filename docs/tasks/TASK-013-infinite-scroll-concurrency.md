# TASK-013 — Stable infinite scroll and cross-device concurrency contract

Status: Complete

## Purpose

Prevent repeated patient-page requests at the bottom sentinel and establish a safe multi-device edit contract so one tablet cannot silently overwrite another tablet's newer patient data.

## Checklist

- [x] Prefetch the next patient page before the loading sentinel becomes visible.
- [x] Add a debounced/cooldown intersection trigger and a synchronous single-flight guard.
- [x] Prevent duplicate fetches for the same page and filter key.
- [x] Preserve the four-page/96-card DOM cap and filter-isolated cache.
- [x] Add automated regression coverage for repeated intersection events.
- [x] Define a versioned patient mutation contract using HTTP ETag/`If-Match` (or ASP.NET row version).
- [x] Add frontend conflict types and handling utilities for `409 Conflict` / `412 Precondition Failed`.
- [x] Document real-time invalidation options for multi-device refresh (SignalR plus Query invalidation).
- [x] Document offline/reconnect and stale-edit behavior.
- [x] Pass typecheck, lint, coverage, build, and Playwright.
- [x] Commit and push TASK-013 to GitHub.

## Verification evidence

- TypeScript and ESLint: passed.
- Vitest: 43/43 passed.
- Coverage: 98.43% statements/lines, 91.98% branches, 89.56% functions.
- Vite modern/legacy production build: passed.
- Playwright: 64/64 multi-device tests passed.

## Infinite-scroll design

- Page size remains 24; maximum live pages remains four.
- Query prefetch starts when the user is within an early threshold of the sentinel, before the visible-bottom trigger.
- Intersection callbacks are debounced and protected by an immediate ref-based lock because React render state alone does not update synchronously enough to prevent two callbacks in one frame.
- The lock is associated with the current filter key/page and released only after the request settles or the key changes.
- TanStack Query continues to deduplicate identical query promises, but UI-level gating is still required to avoid repeated `fetchNextPage` calls and observer churn.

## Cross-device ownership

Backend responsibilities (required for correctness):

- store a monotonically changing version (`rowversion`, revision, or equivalent) for each editable patient resource;
- return it as an `ETag` or explicit version field;
- require `If-Match`/version on update and perform an atomic compare-and-update;
- return `412 Precondition Failed` (or `409 Conflict`) plus the latest safe representation when the version is stale;
- authorize tenant/patient access, validate fields, write audit history, and make retry/idempotency behavior explicit;
- publish change notifications (for example SignalR) after a successful commit.

Frontend responsibilities:

- retain the server version only in the in-memory Query cache/form state;
- send it with every mutation;
- never silently retry a conflicting write;
- on `409/412`, preserve the user's draft, display that another device changed the record, and offer Reload latest / Review changes / Cancel;
- invalidate affected patient, patient-list, and schedule queries after success or a SignalR event;
- show connection freshness and require revalidation after reconnect before submitting a stale form.

## Acceptance criteria

1. A burst of intersection callbacks starts at most one next-page request.
2. The next page is cached before the user reaches the visible bottom under normal scrolling.
3. Infinite mode still renders no more than 96 patient cards.
4. The documented API contract prevents last-write-wins data loss across devices.
5. Frontend conflict handling never discards the local draft or silently overwrites the newer server record.
