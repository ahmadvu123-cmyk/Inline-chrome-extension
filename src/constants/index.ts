export const SUPABASE_PROJECT_URL =
    import.meta.env.VITE_SUPABASE_PROJECT_URL;

export const SUPABASE_PUBLISHER_KEY =
    import.meta.env.VITE_SUPABASE_PUBLISHER_KEY;

export const SYNC_GMAIL_URL =
    `${SUPABASE_PROJECT_URL}/functions/v1/sync-gmail`;

export const CONNECT_GMAIL = `${SUPABASE_PROJECT_URL}/functions/v1/connect-gmail`;

export const SAVE_EMAIL_PATTERNS = `${SUPABASE_PROJECT_URL}/functions/v1/save-email-patterns`;

 

export const GMAIL_API_URL = 'https://gmail.googleapis.com/gmail/v1';