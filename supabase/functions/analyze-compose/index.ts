import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { errorResponse } from "../_shared/errors/error-response.ts";
import { analyzeCompose } from "../_shared/services/gemini-service.ts";
import { ERROR_CODES } from "../_shared/errors/error-codes.ts";
import { validateCompose } from "../_shared/helpers/validate-compose.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: any) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }
    try {
        const body = await req.json();
        if (!body) {
            throw new Error(ERROR_CODES.JSON_PARSE_ERROR);
        }
        const compose = validateCompose(body);
        if (!compose) {
            throw new Error(ERROR_CODES.VALIDATION_ERROR);
        }
        const result = await analyzeCompose(compose);
        const response = new Response(
            JSON.stringify({
                success: true,
                data: {
                    ...result,
                    composeId: compose.composeId,
                },
            }),
            {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        )
        console.log("Analyze Compose relacement response:", response);
        return response;
        
    } catch (error: any) {
        return errorResponse(error, corsHeaders)
    }
})

