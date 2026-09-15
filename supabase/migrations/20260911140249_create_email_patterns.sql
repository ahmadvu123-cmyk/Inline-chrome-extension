CREATE TABLE IF NOT EXISTS "email_patterns" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    pattern TEXT NOT NULL,
    create_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT NULL
);