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

## Task/commit workflow

1. Create or update a task record before implementation.
2. Reference requirement and acceptance criteria.
3. Implement the smallest independently reviewable vertical slice.
4. Run typecheck, lint, tests/coverage, build, security, and applicable accessibility checks.
5. Update the task tracker and development log.
6. Commit with `type(scope): summary [TASK-NNN]`.
7. Push a task branch and open a pull request when a GitHub remote is configured.
