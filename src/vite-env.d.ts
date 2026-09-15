/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_PROJECT_URL: string;
    readonly VITE_SUPABASE_PUBLISHER_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}