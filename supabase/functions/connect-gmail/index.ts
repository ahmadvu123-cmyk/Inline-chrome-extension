import { GMAIL_API_URL } from "../_shared/constants.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { saveUsers } from "../_shared/repositories/user.repository.ts";
import { errorResponse } from "../_shared/errors/error-response.ts";
import { ERROR_CODES } from "../_shared/errors/error-codes.ts";


const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: any) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }
    try {
        const { gmailAccessToken } = await req.json();
        if (!gmailAccessToken) {
            throw new Error(ERROR_CODES.GMAIL_ACCESS_TOKEN_MISSING);
        }
        const userProfile = await fetch(`${GMAIL_API_URL}/users/me/profile`, {
            headers: {
                'Authorization': `Bearer ${gmailAccessToken}`
            }

        })
        if (!userProfile.ok) {
            if (userProfile.status === 401) {
                throw new Error(ERROR_CODES.GMAIL_ACCESS_TOKEN_INVALID);
            }

            if (userProfile.status === 403) {
                throw new Error(ERROR_CODES.GMAIL_PERMISSION_DENIED);
            }

            if (userProfile.status === 429) {
                throw new Error(ERROR_CODES.GMAIL_API_RATE_LIMIT);
            }

            throw new Error(ERROR_CODES.GMAIL_PROFILE_FETCH_FAILED);
        }
        const profile = await userProfile.json();
        console.log("User profile:", profile);

        const response = await saveUsers(profile);
        if (!response) {
            throw new Error(ERROR_CODES.SUPABASE_INSERT_FAILED);
        }
        return new Response(JSON.stringify({
            success: true,
            profile: profile
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        return errorResponse(error, corsHeaders);

    }
})