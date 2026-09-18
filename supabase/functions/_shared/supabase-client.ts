import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_PROJECT_URL, SUPABASE_SECRET_KEY } from "./constants.ts";
import { ERROR_CODES } from "./errors/error-codes.ts";

function createSupabaseClient() {
  try {
    if (!SUPABASE_PROJECT_URL) {
      throw new Error(ERROR_CODES.ENVIRONMENT_VARIABLE_MISSING);
    }

    if (!SUPABASE_SECRET_KEY) {
      throw new Error(ERROR_CODES.ENVIRONMENT_VARIABLE_MISSING);
    }
    const supabaseClient = createClient(
      SUPABASE_PROJECT_URL,
      SUPABASE_SECRET_KEY
    );
    return supabaseClient;
  } catch (error) {
    throw new Error(ERROR_CODES.SUPABASE_ERROR)
  }
}
export const supabase = createSupabaseClient();
