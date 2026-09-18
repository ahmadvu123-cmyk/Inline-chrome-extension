import { ERROR_CODES } from "./errors/error-codes.ts";

const SUPABASE_PROJECT_URL = Deno.env.get("PROJECT_URL");
const SUPABASE_SECRET_KEY = Deno.env.get("SECRET_KEY");
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

if (!SUPABASE_PROJECT_URL) {
    throw new Error(ERROR_CODES.ENVIRONMENT_VARIABLE_MISSING);
}

if (!SUPABASE_SECRET_KEY) {
    throw new Error(ERROR_CODES.ENVIRONMENT_VARIABLE_MISSING);
}

if (!GEMINI_API_KEY) {
    throw new Error(ERROR_CODES.ENVIRONMENT_VARIABLE_MISSING);
}

export {
    SUPABASE_PROJECT_URL,
    SUPABASE_SECRET_KEY,
    GEMINI_API_KEY,
};

export const SYNC_GMAIL_URL =
    `https://${SUPABASE_PROJECT_URL}.supabase.co/functions/v1/sync-gmail`;

export const GMAIL_API_URL =
    "https://gmail.googleapis.com/gmail/v1";