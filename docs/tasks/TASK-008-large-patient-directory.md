# TASK-008 — Large Patient Directory and Device Matrix

## Goal

Keep the Patients directory responsive with a 10,000-record sample contract and guarantee complete, unclipped cards across supported tablet and desktop widths.

## Implementation

- Added typed `PatientPageRequest` and `PatientPage` domain contracts.
- Added deterministic 10,000-record mock data with server-style search and 24-record paging.
- Added 250 ms search debounce and separate React Query cache keys.
- Added user-selectable Pages and Infinite scroll modes; Pages is the default for older devices.
- Kept infinite scroll keyboard-accessible with a visible Load more fallback.
- Added strict grid containment rules and two-column layouts through iPad Pro landscape width.
- Added seven visual profiles and screenshots for all six routes.
- Added a Playwright geometry assertion requiring every Patient card to fit fully inside the dashboard.

## Why

Rendering 10,000 cards would create unnecessary DOM, layout, memory, and paint work on older WebViews. Both modes consume the same bounded page contract, so the user chooses navigation behavior without changing the API or performance envelope.

## Verification

- TypeScript and ESLint: pass.
- Unit/integration: 29/29 pass.
- Coverage: 98.87% statements/lines, 94.85% branches, 83.56% functions.
- Production modern/legacy build: pass.
- Full Playwright suite: 64/64 pass.
- Visual matrix: 42 screenshots across seven profiles; all card-containment checks pass.
