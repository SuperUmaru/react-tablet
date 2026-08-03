# TASK-004 — Staff Tablet and Desktop Operations Walking Skeleton

## Why

Front-desk staff need a denser operational surface than kiosk users. One feature supports both a touch-friendly tablet layout and an information-rich desktop layout.

## Completed

- Clinic/location context and persistent desktop navigation.
- Daily metrics for appointments, arrivals, attention, and checkout.
- Today’s synthetic schedule with patient, service, provider, duration, and status.
- Compact navigation and responsive schedule behavior for tablets.
- Direct entry into the patient kiosk workflow.
- Async loading state and locale-aware times.

## Acceptance evidence

- Integration test verifies loading, rendered appointment data, service information, and check-in navigation.
- Responsive rules target 768×1024, 1024×768, 1280×800, and wider desktop viewports.

## Follow-up

- Implement functional schedule filters, search, patient detail, staff-assisted check-in, and status transitions.
- Replace static date/location text with repository-backed clinic context.

