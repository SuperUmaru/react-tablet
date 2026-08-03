# Multi-Device Patient Concurrency

## Release requirement

The frontend cannot guarantee cross-device write safety by itself. The ASP.NET Core API/database must atomically reject stale updates. Without that backend check, two tablets can both read version 7 and whichever saves last silently destroys the other device's changes.

Recommended contract:

```http
GET /api/patients/pat-205
200 OK
ETag: "patient-pat-205-v7"
Content-Type: application/json
```

```json
{
  "id": "pat-205",
  "firstName": "Nora",
  "lastName": "Bennett",
  "updatedAt": "2026-08-03T15:42:10Z"
}
```

The editing tablet sends the exact version it read:

```http
PATCH /api/patients/pat-205
If-Match: "patient-pat-205-v7"
Content-Type: application/json
Idempotency-Key: 8dfb1b35-...
```

The API performs one atomic operation equivalent to `UPDATE ... WHERE Id = @id AND RowVersion = @expected`. On success it returns the new representation and ETag. If another device already changed the row, it returns:

```http
412 Precondition Failed
ETag: "patient-pat-205-v8"
Content-Type: application/json
```

The body may contain the latest authorized representation and a safe list of changed field names. It must not leak fields the current user cannot view.

## Frontend conflict flow

1. Keep the ETag with the Query-cache record and edit-form snapshot, never in durable browser storage.
2. Send it via `versionedMutationHeaders` on each mutation.
3. `safeJsonRequest` converts `409/412` into `ConcurrentEditError` and never silently retries the write.
4. Preserve the local draft and show: “This patient was updated on another device.”
5. Offer:
   - **Review changes:** compare the user draft with the newest authorized server fields.
   - **Reload latest:** discard only after explicit confirmation.
   - **Cancel:** keep the draft while preventing submission.
6. A deliberate merged save uses the newest ETag and creates a new audit entry.

Do not offer a generic “overwrite anyway” action for demographics, consent, allergies, clinical notes, payments, or appointment state without a product-specific permission and audit policy.

## Near-real-time synchronization

After the database transaction commits, ASP.NET Core should publish a SignalR event containing only identifiers and versions:

```json
{ "type": "patient.updated", "patientId": "pat-205", "version": "v8" }
```

The frontend invalidates `['patient', 'pat-205']`, patient list queries, and schedule queries that reference the patient. Do not broadcast the full patient record. TanStack Query refetches through the authorized API.

While a form is clean, refresh it automatically. While it is dirty, show a non-destructive “Newer data available” banner and require review before save. After SignalR reconnect or browser resume, revalidate the current record before allowing submission because events may have been missed.

## Backend implementation checklist

- SQL Server `rowversion` or another atomic revision column.
- ETag emitted on GET and required through `If-Match` on PATCH/PUT.
- Atomic compare-and-update inside the same transaction as the audit record.
- `412` for stale ETag; reserve `409` for domain conflicts where appropriate.
- Field validation, tenant/object authorization, idempotency, and audit metadata.
- SignalR event only after successful commit; client reconnect revalidation.
- Integration test with two clients: both read v7, A saves to v8, B's v7 save must fail, and A's value must remain.

This two-client integration test is a release gate. Frontend tests alone cannot prove database concurrency safety.
