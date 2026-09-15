import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_PROJECT_URL, SUPABASE_PUBLISHER_KEY } from "./constants.ts";

export const supabase = createClient(
  SUPABASE_PROJECT_URL,
  SUPABASE_PUBLISHER_KEY
);
