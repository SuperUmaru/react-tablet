# TASK-016 — Concise project README and deep code review

Status: Complete

## Purpose

Deeply review the current codebase, keep detailed engineering information in focused documents, and replace the oversized README with an accurate concise introduction.

## Checklist

- [x] Deeply audit code, scripts, configuration, tests, and existing documentation.
- [x] Explain product scope, synthetic-data status, and supported form factors.
- [x] Document all implemented staff and kiosk workflows.
- [x] Explain the modern React architecture and legacy-browser strategy.
- [x] Summarize 10k-record paging/infinite scroll and link its detailed documentation.
- [x] Document concurrency, frontend security, and backend production responsibilities.
- [x] Document centralized telemetry, multilingual notifications, i18n, and accessibility.
- [x] Summarize tests, device coverage, CI, and setup without duplicating runbooks.
- [x] Record prioritized review findings separately from the README.
- [x] Link deeper design/runbook/task documents and verify every claim.
- [x] Commit and push TASK-016 to GitHub.

## Verification

- README reduced to 68 lines with 11 verified local documentation links.
- TypeScript and ESLint passed.
- Review recorded 1 P0, 7 P1, and 9 P2 findings without changing application behavior.

## Acceptance criteria

1. Stakeholders can understand the current product demonstration.
2. Developers can install, run, test, and navigate the architecture from the README.
3. Performance, concurrency, privacy, security, observability, accessibility, and device claims match implementation.
4. Mock boundaries and backend production responsibilities are explicit.
