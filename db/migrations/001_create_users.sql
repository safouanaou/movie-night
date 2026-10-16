CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_email_normalized CHECK (
        email <> ''
        AND email = lower(btrim(email))
        AND email !~ '^[[:space:]]|[[:space:]]$'
    ),
    CONSTRAINT users_password_hash_nonblank CHECK (
        password_hash ~ '[^[:space:]]'
    ),
    CONSTRAINT users_display_name_trimmed CHECK (
        display_name <> ''
        AND display_name = btrim(display_name)
        AND display_name !~ '^[[:space:]]|[[:space:]]$'
    )
);
