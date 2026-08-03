# Task Records

Each completed implementation task has a durable record containing purpose, technical choices, changed areas, acceptance evidence, and follow-up work. Task IDs match `docs/task-tracker.md` and should be referenced in commit messages and pull requests.

| Record | Scope | State |
| --- | --- | --- |
| [TASK-001](TASK-001-project-governance.md) | Requirements, plan, tracker, and log | Complete |
| [TASK-002](TASK-002-react-foundation.md) | Modern React/TypeScript foundation | Complete |
| [TASK-003](TASK-003-tablet-check-in.md) | Tablet-first patient check-in | Walking skeleton complete |
| [TASK-004](TASK-004-staff-dashboard.md) | Tablet/desktop staff dashboard | Walking skeleton complete |
| [TASK-005](TASK-005-quality-accessibility.md) | Tests, coverage, CI, security, WCAG | Automated gates complete; manual AAA audit open |
| [TASK-006](TASK-006-playwright-tablet-observability.md) | Playwright tablet automation and reports | Complete |
| [TASK-007](TASK-007-staff-practice-modules.md) | Overview, Schedule, Patients, Checkout, Settings | Complete walking slice |
| [TASK-008](TASK-008-large-patient-directory.md) | Large patient directory and device matrix | Complete |
| [TASK-009](TASK-009-react-scaffolding-baseline.md) | React primitives and tablet patient controls | Complete |
| [TASK-010](TASK-010-ci-determinism.md) | Timezone-safe clinical times and reliable CI artifacts | Complete |
| [TASK-011](TASK-011-patient-navigation-cache-security.md) | Bounded patient browsing, workflow navigation, and request safety | Complete |
| [TASK-012](TASK-012-tanstack-router.md) | Typed TanStack Router foundation | Complete |
| [TASK-013](TASK-013-infinite-scroll-concurrency.md) | Stable infinite scroll and cross-device concurrency | Complete |
| [TASK-014](TASK-014-patient-portrait-controls.md) | Patient portrait search and filter alignment | Complete |
| [TASK-015](TASK-015-observability-toasts.md) | Centralized observability and multilingual toasts | Complete |
| [TASK-016](TASK-016-comprehensive-readme.md) | Concise README and deep code review | Complete |

## Task/commit workflow

1. Create or update a task record before implementation.
2. Reference requirement and acceptance criteria.
3. Implement the smallest independently reviewable vertical slice.
4. Run typecheck, lint, tests/coverage, build, security, and applicable accessibility checks.
5. Update the task tracker and development log.
6. Commit with `type(scope): summary [TASK-NNN]`.
7. Push a task branch and open a pull request when a GitHub remote is configured.
