# TASK-010 — CI determinism and current GitHub Action runtimes

## Purpose

Keep appointment times clinically correct on every device and make GitHub verification reliable when an earlier quality gate fails.

## Changes

- Added one clinic-time formatter fixed to the mock clinic's `Asia/Bangkok` timezone.
- Applied it to Schedule grouping/cards, Overview appointment times, and kiosk confirmation.
- Added unit coverage for the 1:30 PM appointment and localized date output.
- Upgraded checkout/setup-node/upload-artifact to their Node 24 action generations.
- Made Playwright artifact upload conditional on the Playwright step actually running; a missing report is ignored defensively.

## Acceptance evidence

- The 1:30 PM appointment is grouped under `1 PM` regardless of runner timezone.
- Typecheck, lint, coverage, build, and Playwright pass locally.
- A failed pre-Playwright gate does not attempt to upload nonexistent Playwright paths.
