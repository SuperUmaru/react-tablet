# Frontend observability and notifications

## Production architecture

The browser sends a provider-neutral, JSON-only envelope to `POST /api/telemetry/client-errors`. ASP.NET Core validates the schema, rate-limits by authenticated session and tenant, adds trusted release/environment metadata, and forwards the event to Azure Application Insights, AWS CloudWatch, or another approved provider. Return `202 Accepted`; telemetry failure must never fail a clinical workflow.

Direct browser provider credentials and automatic DOM/session recording are intentionally excluded. The envelope contains a random session ID, random trace ID, route template, status/category, sanitized stack frames, and at most 20 allowlisted action breadcrumbs. It never contains patient/user identifiers, input or visible text, DOM snapshots, query strings, request/response bodies, headers, cookies, tokens, clinical data, or payment data.

## ASP.NET ingestion requirements

- Require HTTPS, normal application authentication, CSRF protection where applicable, a small body limit, strict JSON schema validation, and rate limiting.
- Ignore client-supplied tenant/user/release fields. Add tenant-safe operational dimensions on the server only; prefer pseudonymous IDs and obtain privacy approval before adding any user dimension.
- Forward `traceId`, `sessionId`, `event`, `severity`, `route`, `status`, release, and breadcrumbs. Never log the original HTTP body after validation.
- Sample repeated errors by fingerprint, but retain the first occurrence and all newly introduced release fingerprints.
- Alert on crash/5xx rate and 403 anomaly rate, not on individual customer actions. Restrict access and set region/retention with compliance owners.
- Upload production source maps privately during CI and associate them with a release ID. Do not publish `.map` files from the web server.

## Provider choices

Azure is the recommended first target because the backend is ASP.NET Core. Export server-side with Azure Monitor OpenTelemetry/Application Insights and keep the connection string in server configuration. Azure documents that browser connection strings are visible, not secrets, and recommends a proxy when authenticated browser ingestion is required.

AWS is supported by mapping the same envelope into structured CloudWatch Logs/metrics. CloudWatch RUM can be evaluated later, but automatic collection must remain off until its privacy fields, cookies, session samples, and regional data controls pass clinical privacy review. AWS explicitly warns against putting personal or sensitive identifiers in free-form RUM fields.

References: [Azure Application Insights connection strings](https://learn.microsoft.com/en-us/azure/azure-monitor/app/connection-strings), [Azure JavaScript SDK guidance](https://learn.microsoft.com/en-us/azure/azure-monitor/app/javascript-sdk), [CloudWatch RUM configuration](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-configure-client.html), [CloudWatch RUM privacy](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-privacy.html), and [CloudWatch RUM source maps](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-JavaScriptStackTraceSourceMaps.html).

## User notification policy

Only meaningful asynchronous completion (for example settings save or payment) creates a success toast. Navigation and successful reads do not. A screen with its own prominent completion state, such as kiosk check-in, does not add a redundant toast. Toasts are translated, announced through a polite live region, deduplicated, limited to three, dismissible with a 44px target, and motion-safe. Recoverable failures show a clear local error; only crashes, unhandled failures, 403, and 5xx reach centralized telemetry.

## Release checklist

1. Deploy and load-test the ingestion endpoint before enabling alerts.
2. Verify a synthetic crash and synthetic 500 in staging; search both by the displayed trace ID.
3. Inspect captured payloads for PHI/PII and run the privacy/security review.
4. Confirm private source-map symbolication and release tagging.
5. Verify alert routing, on-call ownership, retention, RBAC, sampling, and cost limits.
