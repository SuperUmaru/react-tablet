# Tablet Compatibility and Performance Strategy

## Is Vite the right React best practice?

Yes for this incremental SPA migration. Vite provides a small, conventional React build, fast development, static deployment, code splitting, and an official legacy plugin. Next.js would add server/runtime concepts that the current kiosk and ASP.NET Core API architecture does not require.

Vite does not guarantee old-device compatibility by itself. Its default production bundle assumes Chrome 111+, Edge 111+, Firefox 114+, and Safari 16.4+. This project now produces a modern bundle plus conditional legacy chunks targeting iOS 12+ and Chrome/WebView 70+. Vite’s official documentation notes that the legacy plugin supplies legacy chunks and ES language polyfills; application/browser API compatibility still needs testing.

Sources: [Vite production browser compatibility](https://vite.dev/guide/build#browser-compatibility), [Android WebView overview](https://developer.chrome.com/docs/webview), and [Apple Safari web-content guidance](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/Introduction/Introduction.html).

## Support tiers

Do not use “tablet” as a single compatibility category. Record exact model, OS version, browser/WebView version, RAM, orientation, and peripherals.

| Tier | Suggested baseline | Commitment |
| --- | --- | --- |
| Certified clinic | Managed iPad/iPadOS or Android tablet from the clinic inventory, current security updates, current Safari/Chrome/WebView | Full check-in/checkout certification, accessibility, peripherals, performance SLA, priority defect support |
| Supported older | iOS 12+ Safari/WKWebView or Android WebView/Chrome 70+, at least 2 GB RAM | Core kiosk workflow, simplified effects, functional layout; test representative real devices before release |
| Unsupported/replace | Browser older than native ESM baseline, unpatched OS/WebView, less than 2 GB RAM, or device cannot meet privacy/performance requirements | Show an upgrade/unsupported message; do not use for clinical production |

The original iPad Air and “old Android tablet” labels are not precise enough for certification. Obtain the Settings/About OS build and browser/WebView version. A device that cannot receive security patches should not handle patient information even if a polyfilled UI technically renders.

## Improvements already applied

- Modern and legacy Vite bundles; old browsers download legacy code, modern tablets do not pay that cost.
- Build target set to ES2018 with official legacy targets for iOS 12+ and Chrome 70+.
- Removed `structuredClone`, which is unavailable on older Safari/WebView, from the mock adapter.
- Added WebKit-prefixed backdrop filtering with an opaque background fallback.
- Added focus styling that degrades safely when `:focus-visible` is unavailable.
- Added Playwright touch profiles for portrait/landscape and a low-power profile with 4× CPU slowdown, 150 ms latency, and constrained throughput.
- Added a 5-second throttled readiness budget and long-task evidence attachment.

## Smooth UI rules for old and new tablets

### JavaScript

- Keep kiosk entry code small; lazy-load staff administration, reports, editors, and charts.
- Avoid large client-side tables and expensive re-renders; paginate/virtualize staff lists after measuring.
- Split work longer than 50 ms and never perform heavy parsing/calculation during touch input. Chrome’s guidance recommends breaking up long tasks so the main thread can respond to interactions.
- Use stable component props, derive state instead of duplicating it, and profile before adding memoization.
- Abort obsolete API requests and debounce only high-frequency search—not primary buttons.

### Rendering and animation

- Prefer opacity/transform animation; avoid animating layout properties and large blurred surfaces.
- Disable nonessential motion with `prefers-reduced-motion` and offer a low-effects mode if actual old hardware shows GPU pressure.
- Limit shadows, backdrop filters, sticky layers, and simultaneous skeleton animations.
- Reserve dimensions to prevent layout shift and keep touch targets at least 44×44 pixels.

### Assets and network

- Use the current system font stack, or self-host approved fonts later; do not add third-party runtime font requests.
- Compress images, provide explicit dimensions, and use responsive sources.
- Cache hashed JS/CSS for a long duration but serve `index.html` with revalidation so deployments do not leave stale chunk references.
- Do not cache patient/API responses in a service worker until secure offline synchronization is explicitly designed.

### React architecture

- Keep server state in TanStack Query and local interaction state close to components.
- Use feature-level lazy imports once more routes/modules exist.
- Keep context providers small and stable; do not put rapidly changing form data in global context.
- Prefer semantic native controls and CSS responsiveness over JavaScript device detection.
- Detect capabilities only when necessary; do not branch business behavior by user-agent string.

## Real-device test matrix

Automated portrait reference profiles now include iPad Mini, iPad Air, and iPad Pro dimensions. These catch responsive breakpoint and geometry regressions, but physical Safari validation remains required for release.

Automation is necessary but cannot emulate Safari/WebKit versions, memory pressure, thermal throttling, kiosk management, on-screen keyboard behavior, or peripherals accurately.

For each certified device, record:

- Manufacturer/model and year/generation.
- OS build and available security updates.
- Safari version or Android System WebView/Chrome version.
- RAM/storage and free storage.
- Portrait/landscape and split-screen behavior.
- On-screen keyboard, autofill, date input, focus, zoom, and rotation.
- Wi-Fi roaming, slow network, interruption, reload, timeout, and recovery.
- Printer, scanner, camera, signature device, and payment-terminal integration.
- Check-in completion time, first usable screen, input delay, memory crash/reload, and battery/thermal behavior.

Use Apple’s Web Inspector with a connected iPad/iPadOS device and Chrome DevTools remote debugging for Android WebView. Apple documents inspection of webpages and Home Screen web apps on physical devices; Android documents that WebView supports remote debugging.

## Performance budgets

Initial budgets to validate and refine on the slowest supported clinic tablet:

| Metric | Kiosk target |
| --- | --- |
| First usable screen on clinic Wi-Fi | ≤ 3 seconds certified; ≤ 5 seconds supported older |
| Interaction response | No visible action ignored; target INP ≤ 200 ms certified |
| Long main-thread task | None above 200 ms; minimize tasks above 50 ms |
| Initial modern JS gzip | ≤ 120 kB for kiosk entry before feature expansion |
| Layout overflow | None at certified portrait/landscape viewports |
| Crash/reload during 30-minute soak | Zero |

The current combined modern JS build was approximately 93 kB gzip before the legacy plugin. Monitor modern and legacy outputs separately in CI; legacy tablets will pay a larger polyfill cost.

## Rollout recommendation

1. Inventory actual clinic tablets before selecting the final minimum versions.
2. Choose one slowest supported iPad/WebKit and one slowest supported Android/WebView device as release gates.
3. Run Playwright on every change and physical-device smoke/soak tests for release candidates.
4. Pilot one clinic with telemetry that excludes patient data.
5. Block or replace devices with unsupported/unpatched runtimes rather than silently degrading a clinical workflow.
