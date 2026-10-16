# Registration API contract

Status: draft for the next feature, not an implemented endpoint. The users table has been created and its structure inspected; registration and behavioral constraint checks have not yet been verified. Input limits below are proposed MVP choices for review.

## Purpose

As a visitor, I want to create an account so I can create or join movie nights.

`POST /api/auth/register` accepts a JSON object. No existing login is required. Registration creates an account but does not automatically sign the user in; login and session handling are separate work.

## Request and validation

Require `Content-Type: application/json`. Reject malformed JSON and bodies that are not objects, including arrays and null. Require all three fields as strings; do not silently convert numbers or other types to strings. Reject unknown fields so callers cannot supply an ID, password hash, creation timestamp or host status.

| Field | Normalization | Proposed validation |
|---|---|---|
| `email` | Trim surrounding whitespace, then lowercase the whole value. | 3–254 characters after normalization. For the first release, accept ASCII email addresses with one `@`, a nonempty local part and a dotted domain. No whitespace/control characters; local part at most 64 characters, with letters, digits and standard email local-part punctuation; dots cannot be leading, trailing or consecutive. Domain labels contain letters, digits or hyphens, are 1–63 characters, and cannot start/end with hyphens. Quoted local parts, address literals and internationalized addresses are outside this initial policy. |
| `password` | None. Preserve exactly as entered. | 15–128 Unicode code points; reject all-whitespace values. Allow spaces and symbols without mandatory character categories. Do not truncate. |
| `displayName` | Trim surrounding whitespace; preserve capitalization and internal spaces. | 1–80 Unicode code points after normalization; reject control characters. Names do not need to be unique. |

These are application validation rules, not changes to the database's `text` types. Email syntax validation does not verify ownership or deliverability. Email verification and password reset are not part of this endpoint.

Example request (invented credentials only):

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": " Sam@Example.com ",
  "password": "example-only moonlit movie night",
  "displayName": " Sam Smith "
}
```

The stored email is `sam@example.com`, the display name is `Sam Smith`, and the password is hashed without normalization.

## Successful response

Return `201 Created` only after the account is saved. Return an explicit allowlist of public account fields, never the submitted password or saved hash. Serialize the bigint ID as a string to avoid JavaScript integer precision loss; serialize the timestamp as an ISO 8601 UTC string.

Example response; the ID and time are illustrative:

```json
{
  "user": {
    "id": "1",
    "email": "sam@example.com",
    "displayName": "Sam Smith",
    "createdAt": "2026-10-16T12:00:00.000Z"
  }
}
```

The frontend can then direct the user to sign in. This response creates no authenticated session.

## Errors

Use a stable `error.code` and a readable `error.message`. Field errors may identify invalid fields, but must not echo passwords or the entire request body.

| HTTP status | Error code | Condition |
|---|---|---|
| 400 | `INVALID_JSON` | Request body cannot be parsed as JSON. |
| 400 | `VALIDATION_ERROR` | Invalid body shape, missing/unknown fields, wrong types or invalid values. |
| 409 | `EMAIL_ALREADY_EXISTS` | Normalized email already belongs to an account. |
| 413 | `PAYLOAD_TOO_LARGE` | Request exceeds the proposed 16 KiB JSON body limit. |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Request is not sent as JSON. |
| 429 | `RATE_LIMITED` | Registration rate limit exceeded; send `Retry-After`. Exact limit/store remains to be chosen before release. |
| 503 | `DATABASE_UNAVAILABLE` | Database cannot be reached. |
| 500 | `INTERNAL_ERROR` | Unexpected failure, including hashing or unexpected database errors. |

Do not return stack traces, SQL, credentials or raw database errors. Log only the diagnostic information needed without passwords or hashes. Rate limiting and consistent parser/body-limit error handling must be wired into Express; they do not happen merely because they appear in this contract.

### Duplicate-email example

If `sam@example.com` exists, submitting `SAM@example.com` also conflicts after normalization. Return `409`:

```json
{
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "An account with this email already exists."
  }
}
```

This MVP response reveals whether an email is registered; review that tradeoff before public release.

### Invalid-input example

For a missing display name or an invalid email, return `400`:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Check the registration fields.",
    "fields": {
      "email": "Enter a supported email address.",
      "displayName": "Display name is required."
    }
  }
}
```

## Server responsibilities

1. Enforce content type/body limits, validate types and normalize the appropriate fields.
2. Validate the normalized email/name and original password before hashing or inserting.
3. Hash the password with Argon2id. Never store plaintext passwords or use a general-purpose fast hash as password storage. Select and document explicit hashing parameters during implementation.
4. Insert only the normalized email/name and generated password hash using a parameterized SQL query. PostgreSQL supplies the ID and creation timestamp.
5. Use the unique email constraint as the final authority. An optional precheck cannot prevent simultaneous registrations; handle the specific `users_email_key` unique violation as a conflict rather than treating every constraint error as a duplicate email.
6. Return only the public fields after a successful insert, or the appropriate safe error.

Do not keep a database transaction/connection checked out while hashing. A single account insert does not require a multi-statement transaction.

## Retries and concurrency

- Repeating registration with the same normalized email does not create a second account; it returns `409` after the first succeeds.
- Two simultaneous submissions for one normalized email produce at most one account.
- If insertion succeeds but the response is lost, retrying may return `409`. A timeout alone does not prove the account was not created. Direct the user toward login/recovery rather than claiming the password matched the existing account.

## Completion checks

- Valid registration returns `201` and persists one account with generated ID/time and a verifiable Argon2id hash.
- Case/whitespace variants of the same email cannot create multiple accounts, including concurrent requests.
- Invalid input creates no account; validation covers nonobject bodies, wrong types, unknown fields and limits.
- Display names are trimmed, while password spaces/case are preserved during hashing and verification.
- Passwords/hashes never appear in responses or logs.
- Expected errors match this contract; database failure never produces a success response.
- Successful registration alone does not grant access to member-only resources.

Related: [users table](users-table.md), [rules](rules.md) and [roadmap](ROADMAP.md).
