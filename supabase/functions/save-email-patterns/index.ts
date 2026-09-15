import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GEMINI_API_KEY } from "../_shared/constants";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: any) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }
    try {
        const emailsResponse = await req.json();
        console.log("Emails response patterns:", emailsResponse);
        if (!emailsResponse) {
            return new Response(JSON.stringify({ error: 'Emails Data is required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        


    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        });
    }
});