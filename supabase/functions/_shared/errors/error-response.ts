import { handleError } from "./error-handler.ts";

export function errorResponse(
  error: unknown,
  corsHeaders: Record<string, string>
) {
  const normalizedError = handleError(error);

  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code: normalizedError.code,
        message: normalizedError.message,
      },
    }),
    {
      status: normalizedError.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}