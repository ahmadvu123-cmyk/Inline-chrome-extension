CREATE TABLE IF NOT EXISTS "emails" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL, 
    email_history_id TEXT NOT NULL,
    date TEXT NOT NULL,
    thread_id TEXT NOT NULL,
    lables TEXT,
    email_message TEXT NOT NULL,
    create_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT NULL,

    CONSTRAINT fk_emails_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);