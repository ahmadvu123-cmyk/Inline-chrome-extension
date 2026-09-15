export const SUPABASE_PROJECT_URL =
    Deno.env.get("PROJECT_URL");

export const SUPABASE_PUBLISHER_KEY =
    Deno.env.get("PUBLISHER_KEY");

export const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

export const SYNC_GMAIL_URL =
    `https://${SUPABASE_PROJECT_URL}.supabase.co/functions/v1/sync-gmail`;

export const SAVE_EMAIL_PATTERNS = `https://${SUPABASE_PROJECT_URL}.supabase.co/functions/v1/save-email-patterns`;

export const GMAIL_API_URL = 'https://gmail.googleapis.com/gmail/v1';