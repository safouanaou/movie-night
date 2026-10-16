# Users table specification

Status: initial implementation specification based on [ERD.md](ERD.md) and the account requirements in [rules.md](rules.md). The table and migration have not yet been implemented.

## Purpose

The `users` table stores accounts belonging to Movie-night. A row represents one account, not one night membership. Host status belongs to a particular movie night and is not a column on this table.

## Columns

| Column | PostgreSQL type | Nullable? | Default / generation | Constraints and purpose |
|---|---|---|---|---|
| `id` | `bigint` | No | Generated always as identity | Primary key; database-generated identifier. Never accept an account ID from a registration form. |
| `email` | `text` | No | None | Unique; stored trimmed and lowercase. A database check requires a nonempty value equal to its trimmed, lowercase form. |
| `password_hash` | `text` | No | None | Nonblank; stores the encoded Argon2id hash, including its salt and parameters. Never store a plaintext password. |
| `display_name` | `text` | No | None | Trimmed and nonempty, enforced by a database check. Names need not be unique. |
| `created_at` | `timestamptz` | No | Current timestamp | Time the account was created; supplied by the database when omitted. |

The primary key enforces uniqueness and non-nullability of `id`. Each other column explicitly requires a value. A non-null text field can still contain an empty string, so required text fields also need the stated checks.

## Email policy

For this MVP, registration and login trim surrounding whitespace and lowercase the entire email before using it. The database also checks that stored email is canonical and enforces uniqueness on it. Consequently, `Sam@example.com` and ` sam@example.com ` identify the same login email after normalization. Direct noncanonical inserts are rejected, not silently transformed by the database.

This is an application policy, not a claim that every email provider treats all casing identically. Complete email validation and input-length limits must be specified for registration; the database normalization check alone does not establish a valid or verified email address.

## Password handling

Express will hash passwords using Argon2id before insertion and verify submitted passwords against the saved hash during login. Hashing is one-way, unlike reversible encryption. A required/nonblank database field does not prove a value is a real Argon2id hash; correct hashing is a server responsibility.

Never return `password_hash` through the API or include passwords/hashes in logs. The hashing implementation and password policy will be addressed with registration, not in the first table migration.

## Relationships and deletion

This first table has no foreign keys. Later tables reference users for hosts and memberships. Do not implement account deletion or cascading historical-data removal until the retention policy is settled.

## First migration

Write the schema in `db/migrations/001_create_users.sql`. This numbered file records the database change so it can be applied consistently in each environment. Keep connection settings and test accounts outside it. A migration runner and applied-migration tracking still need to be selected; the filename alone does not track whether it ran.

## Verification targets

- Inspect the table and confirm all five columns, identity generation, primary key, unique email, checks and timestamp default.
- A valid account receives an ID and creation timestamp without explicitly supplying them.
- Duplicate normalized emails, missing required fields, blank required text and noncanonical email/display names are rejected.
- Two accounts may share a display name.
- Use invented data and valid application-generated hashes when testing account creation. Do not insert real passwords as placeholder hashes.

The first inspection confirms schema structure. Behavioral constraint checks come after the migration is reviewed and applied; none have passed yet.
