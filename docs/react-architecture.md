# React Architecture Baseline

## Build and language

- React 19 with strict TypeScript and `noUncheckedIndexedAccess`.
- Vite for the client build and development server.
- Official Vite legacy output for iOS 12+ and Chrome/WebView 70+.
- Vitest for unit/integration tests and Playwright for browser/device tests.

Vite is preferred over Next.js here because the React application is a client-side migration embedded beside an existing ASP.NET/jQuery product. Server rendering and a Node application server are not current requirements.

## State boundaries

- **Server state:** TanStack Query owns asynchronous API data, caching, loading/error state, mutations, and invalidation.
- **URL state:** route, filter, sort, and shareable selection should move into URL parameters as routing matures.
- **Local UI state:** `useState`/`useReducer` owns temporary form state, disclosure state, and view preferences.
- **Cross-feature client state:** add a small external store only when one concrete state value must be shared across unrelated routes. Redux/Zustand is not installed preemptively.

This prevents API responses from being duplicated into a global client store.

## Component library

Radix Primitives is the accessibility/behavior baseline for complex controls such as Select, Dialog, Popover, Dropdown Menu, Tabs, and Tooltip. Application code wraps primitives in `src/components/ui` so feature pages do not depend on raw primitive composition.

Use native HTML for simple buttons, links, inputs, and checkboxes. Use a Radix primitive where focus management, keyboard navigation, collision handling, or ARIA interaction behavior is non-trivial. The first wrapper is `SelectField`, used by Settings.

Bootstrap 3 stays inside the legacy UI boundary. Do not introduce Bootstrap 5 because its global selectors and JavaScript behavior would make coexistence and eventual removal harder.

## Design tokens

Semantic CSS custom properties live in `src/styles/tokens.css`:

- `--color-*` for roles rather than raw palette names
- `--space-*` for spacing rhythm
- `--radius-*` for shape
- `--control-min-height` for touch controls
- `--shadow-*` for elevation

Old token aliases remain temporarily while feature CSS is migrated. New components use semantic tokens. Theme or clinic-brand overrides should replace token values at a scoped root, not duplicate component CSS.

## Folder responsibilities

```text
src/
  components/       Shared product components
    ui/              Wrapped component-library primitives
  data/              API/mock adapters only
  domain/            Framework-independent contracts and rules
  pages/             Route-level feature composition
  styles/            Tokens and future layered styles
  test/              Shared unit-test harness
tests/e2e/            Playwright workflows and visual device matrix
```

## Adoption rules

1. Preserve a working route while replacing one component at a time.
2. Keep data access behind typed repository interfaces.
3. Add a UI wrapper before repeating a raw Radix composition.
4. Verify keyboard, touch, focus, zoom, contrast, and screen-reader behavior; a library does not by itself prove WCAG 2.1 AAA conformance.
5. Run unit coverage, production build, Playwright workflows, and visual-device screenshots before merging.
