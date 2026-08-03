# TASK-003 — Tablet-first Patient Check-in Walking Skeleton

## Why

Patient check-in is the internal-launch priority. The experience is purpose-built for a clinic tablet rather than being a resized desktop page.

## Completed

- Private welcome/lookup screen with large touch controls.
- Phone-last-four and date-of-birth appointment lookup.
- Appointment confirmation and identity rejection path.
- Mock arrival mutation, completion message, and explicit session reset.
- No-match error and duplicate-action protection while requests are active.
- English/Spanish switching and locale-aware appointment date/time.
- Tablet landscape/portrait layout styles; mobile is not an acceptance target.

## Accessibility design

- Semantic form labels, native date field, live error alert, busy state, skip link, visible focus, 44+ pixel controls, reduced-motion support, and strengthened AAA contrast tokens.
- Patient identity data is not placed in URLs or persistent storage.

## Acceptance evidence

- Integration tests cover no-match recovery, matched confirmation, completed check-in, session clearing, and incorrect-identity recovery.
- Demo synthetic record: phone `0184`, date of birth `1988-04-12`.

## Follow-up

- Add demographics, dynamic intake, consent/signature, review, timeout warning/extension, and staff-assisted recovery.
- Complete real-device and manual WCAG 2.1 AAA conformance review.

