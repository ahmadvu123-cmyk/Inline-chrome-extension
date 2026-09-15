import { GMAIL_API_URL } from "../_shared/constants.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { saveUsers } from "../_shared/repositories/user.repository.ts";

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
        const userProfile = await fetch(`${GMAIL_API_URL}/users/me/profile`, {
            headers: {
                'Authorization': `Bearer ${gmailAccessToken}`
            }

        })
        const profile = await userProfile.json();
        console.log("User profile:", profile);

        await saveUsers(profile);
        return new Response(JSON.stringify({
            success: true,
            profile: profile
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    }
})