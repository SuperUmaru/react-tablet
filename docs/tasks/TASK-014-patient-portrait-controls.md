# TASK-014 — Patient portrait search and filter alignment

Status: Complete

## Purpose

Correct the Patients search/filter controls in portrait mode and prevent alignment or overflow regressions on iPad Mini, iPad Air, and iPad Pro.

## Checklist

- [x] Capture the Patients page at representative iPad Mini, Air, and Pro portrait viewports.
- [x] Align search text, search icon, loading-mode control, result count, Select text, and Select chevron vertically.
- [x] Improve portrait composition without reducing touch targets below 44 CSS pixels.
- [x] Ensure controls do not overlap, clip, or overflow at supported tablet widths.
- [x] Add Playwright portrait projects/assertions and screenshots for all three iPad sizes.
- [x] Re-run typecheck, lint, coverage, build, and the complete E2E matrix.
- [x] Update task/log documentation and push the verified commit to GitHub.

## Acceptance criteria

1. Search input content and icon share a stable visual centerline.
2. Every dropdown label and chevron is centered within its trigger.
3. Filters form complete rows—no partial, clipped, or uneven controls.
4. iPad Mini, Air, and Pro portrait screenshots have no page-level horizontal overflow.
5. Automated geometry checks fail if icons/labels drift outside their control center tolerance.

## Verification evidence

- Visual review completed for iPad Mini, Air, and Pro Patients screenshots.
- Search icon/input and dropdown chevron centerlines pass the 2px tolerance.
- TypeScript and ESLint: passed.
- Vitest: 43/43 passed; 98.43% statements/lines, 91.98% branches, 89.56% functions.
- Modern/legacy production build: passed.
- Playwright: 82/82 tests passed across the expanded device matrix.
