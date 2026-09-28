export const SUPABASE_PROJECT_URL =
    import.meta.env.VITE_SUPABASE_PROJECT_URL;

export const SUPABASE_SECRET_KEY =
    import.meta.env.VITE_SUPABASE_SECRET_KEY;

export const OPEN_ROUTER_KEY = import.meta.env.VITE_OPEN_ROUTER_KEY;

export const SYNC_GMAIL_URL =
    `${SUPABASE_PROJECT_URL}/functions/v1/sync-gmail`;

export const CONNECT_GMAIL_URL = `${SUPABASE_PROJECT_URL}/functions/v1/connect-gmail`;

export const ANALYZE_COMPOSE_URL =
  `${SUPABASE_PROJECT_URL}/functions/v1/analyze-compose`;

 

export const GMAIL_API_URL = 'https://gmail.googleapis.com/gmail/v1';