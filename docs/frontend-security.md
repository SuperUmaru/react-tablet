# Frontend Security and HTTPS Deployment Contract

## Frontend controls

The React application uses `safeJsonRequest` for future REST adapters. It allows only same-origin requests plus one explicitly configured API origin, blocks HTTPS-to-HTTP downgrade, aborts slow requests, rejects redirects, requires JSON, checks HTTP status, and validates response bodies with Zod.

`VITE_API_ORIGIN` is public configuration embedded in the bundle. Never use a `VITE_*` variable for a secret.

Only the versioned key below is currently allowed in Web Storage:

| Key | Storage | Content | Sensitive |
| --- | --- | --- | --- |
| `aurelia.ui.patient-loading-mode.v1` | localStorage | `pages` or `scroll` | No |

Patient records, names, tokens, permissions, tenant IDs, appointment context, payment data, and clinical data must not be placed in localStorage or sessionStorage. TanStack Query holds API data in memory and loses it when the tab closes.

## Backend and hosting controls

ASP.NET Core and the production HTTPS edge must enforce these controls; React cannot enforce them securely:

- authenticate users and authorize tenant, patient, appointment, checkout, and settings access on every request;
- use opaque `HttpOnly; Secure; SameSite=Lax` or stricter session cookies and server-side CSRF protection for state changes;
- keep API keys, signing keys, database credentials, and encryption keys in a managed secret store;
- validate all request fields, apply object-level authorization, rate limits, audit logging, and replay/idempotency controls;
- configure a narrow CORS allowlist when the API is cross-origin;
- reject untrusted forwarded-host/proxy headers and require TLS end to end;
- avoid patient names or other health information in URLs, logs, analytics, traces, and error reporting.

Recommended production response headers (values must be adapted to the real hosting/CDN and API origins):

```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data:; font-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.example.com; upgrade-insecure-requests
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
X-Content-Type-Options: nosniff
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-site
```

The CSP should use nonces/hashes and remove `'unsafe-inline'` after styles are extracted into a nonce-compatible policy. Do not add these as HTML meta tags and assume equivalent protection: HSTS, framing policy, and several other controls require HTTP response headers.

## Patient navigation

Directory and detail links use a synthetic `patientId`. The Schedule page resolves that ID through the repository and does not put the patient's name in the URL. An ID is still untrusted input: the backend must verify that the current user and tenant may access it before returning any record.
