# TASK-006 — Playwright Tablet Automation and Observability

## Why

Unit/component tests cannot prove that the full application works at actual tablet viewports with browser navigation, touch capability, layout, focus, and integrated accessibility rules. Playwright supplies repeatable evidence and failure artifacts.

## Scope

- Tablet landscape, tablet portrait, and desktop Chromium projects.
- Low-power tablet profile with CPU/network throttling and readiness/long-task artifacts.
- Full patient check-in and reset journey.
- No-match recovery.
- Staff dashboard rendering, overflow, and kiosk navigation.
- Axe WCAG A/AA detection as one input to the required manual AAA audit.
- HTML/JSON reports, screenshots, traces, video, and GitHub Actions artifacts.

## Acceptance

- `npm run test:e2e:tablet` passes both tablet projects.
- The throttled low-power project meets the documented initial performance budget.
- `npm run test:e2e` passes all configured projects.
- Failure artifacts identify viewport/project and include enough context to reproduce the problem.
- Operating and debugging commands are documented in `docs/playwright-tablet-testing.md`.
