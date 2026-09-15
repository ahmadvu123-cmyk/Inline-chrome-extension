CREATE TABLE IF NOT EXISTS "users" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    total_messages INTEGER DEFAULT 0,
    total_threads INTEGER DEFAULT 0,
    history_id TEXT NOT NULL,
    created_At TIMESTAMPTZ DEFAULT now(),
    updated_At TIMESTAMPTZ DEFAULT NULL
)