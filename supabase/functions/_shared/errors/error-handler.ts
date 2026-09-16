export interface NormalizedError {
    code: string;
    status: number;
    message: string;
}

function getStatusCode(error: unknown): number | undefined {
    if (
        typeof error === "object" &&
        error !== null &&
        "status" in error
    ) {
        const status = (error as { status?: unknown }).status;

        if (typeof status === "number") {
            return status;
        }
    }

    return undefined;
}

function getErrorCode(error: unknown): string | undefined {
    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error
    ) {
        const code = (error as { code?: unknown }).code;

        if (typeof code === "string") {
            return code;
        }
    }

    return undefined;
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
    ) {
        const message = (error as { message?: unknown }).message;

        if (typeof message === "string") {
            return message;
        }
    }

    return "";
}

function isGeminiError(error: unknown): boolean {
    const message = getErrorMessage(error).toLowerCase();

    return (
        message.includes("googlegenerativeai") ||
        message.includes("generativelanguage.googleapis.com") ||
        message.includes("gemini") ||
        message.includes("google ai")
    );
}

function isSupabaseError(error: unknown): boolean {
    const code = getErrorCode(error);

    return typeof code === "string" && /^[0-9A-Z]{5}$/.test(code);
}

function isNetworkError(error: unknown): boolean {
    const message = getErrorMessage(error).toLowerCase();

    return (
        message.includes("failed to fetch") ||
        message.includes("fetch failed") ||
        message.includes("network error") ||
        message.includes("network request failed") ||
        message.includes("connection refused") ||
        message.includes("connection reset") ||
        message.includes("socket") ||
        message.includes("econnrefused") ||
        message.includes("enotfound") ||
        message.includes("etimedout")
    );
}

function isTimeoutError(error: unknown): boolean {
    const message = getErrorMessage(error).toLowerCase();

    return (
        message.includes("timeout") ||
        message.includes("timed out") ||
        message.includes("deadline exceeded")
    );
}

export function handleError(error: unknown): NormalizedError {
    console.error("Original error:", error);

    const status = getStatusCode(error);
    const code = getErrorCode(error);
    const message = getErrorMessage(error);

    if (isGeminiError(error)) {
        if (status === 401 || status === 403) {
            return {
                code: "LLM_AUTHENTICATION_FAILED",
                status,
                message:
                    "AI service authentication failed. Please try again later.",
            };
        }

        if (status === 400) {
            return {
                code: "LLM_INVALID_REQUEST",
                status: 400,
                message:
                    "The AI request was invalid. Please try again.",
            };
        }

        if (status === 404) {
            return {
                code: "LLM_MODEL_NOT_FOUND",
                status: 502,
                message:
                    "The requested AI model is unavailable. Please try again later.",
            };
        }

        if (status === 408) {
            return {
                code: "LLM_REQUEST_TIMEOUT",
                status: 504,
                message:
                    "The AI request timed out. Please try again.",
            };
        }

        if (status === 429) {
            return {
                code: "LLM_RATE_LIMITED",
                status: 429,
                message:
                    "AI request limit reached. Please try again later.",
            };
        }

        if (status === 500) {
            return {
                code: "LLM_INTERNAL_ERROR",
                status: 502,
                message:
                    "The AI service encountered an error. Please try again later.",
            };
        }

        if (status === 502 || status === 503 || status === 504) {
            return {
                code: "LLM_SERVICE_UNAVAILABLE",
                status: 503,
                message:
                    "AI service is temporarily unavailable. Please try again later.",
            };
        }

        return {
            code: "LLM_GENERATION_FAILED",
            status: 502,
            message:
                "Unable to generate email patterns. Please try again.",
        };
    }

    if (isSupabaseError(error)) {
        switch (code) {
            case "23502":
                return {
                    code: "DATABASE_REQUIRED_FIELD",
                    status: 400,
                    message:
                        "Required information is missing.",
                };

            case "23503":
                return {
                    code: "DATABASE_REFERENCE_ERROR",
                    status: 400,
                    message:
                        "The requested record has an invalid reference.",
                };

            case "23505":
                return {
                    code: "DATABASE_DUPLICATE",
                    status: 409,
                    message:
                        "This record already exists.",
                };

            case "23514":
                return {
                    code: "DATABASE_CONSTRAINT_VIOLATION",
                    status: 400,
                    message:
                        "The provided data does not meet the required conditions.",
                };

            case "23504":
                return {
                    code: "DATABASE_CONSTRAINT_VIOLATION",
                    status: 400,
                    message:
                        "The provided data violates a database constraint.",
                };

            case "23506":
                return {
                    code: "DATABASE_CONSTRAINT_VIOLATION",
                    status: 400,
                    message:
                        "The provided data violates a database constraint.",
                };

            case "22P02":
                return {
                    code: "DATABASE_INVALID_DATA",
                    status: 400,
                    message:
                        "The provided data has an invalid format.",
                };

            case "22001":
                return {
                    code: "DATABASE_VALUE_TOO_LONG",
                    status: 400,
                    message:
                        "One of the provided values is too long.",
                };

            case "22003":
                return {
                    code: "DATABASE_VALUE_OUT_OF_RANGE",
                    status: 400,
                    message:
                        "One of the provided values is out of range.",
                };

            case "23514":
                return {
                    code: "DATABASE_CHECK_VIOLATION",
                    status: 400,
                    message:
                        "The provided data does not meet the required conditions.",
                };

            case "42501":
                return {
                    code: "DATABASE_PERMISSION_DENIED",
                    status: 403,
                    message:
                        "You do not have permission to perform this database operation.",
                };

            case "42P01":
                return {
                    code: "DATABASE_TABLE_NOT_FOUND",
                    status: 500,
                    message:
                        "A required database table was not found.",
                };

            case "42703":
                return {
                    code: "DATABASE_COLUMN_NOT_FOUND",
                    status: 500,
                    message:
                        "A required database column was not found.",
                };

            case "42883":
                return {
                    code: "DATABASE_FUNCTION_NOT_FOUND",
                    status: 500,
                    message:
                        "A required database function was not found.",
                };

            case "23521":
                return {
                    code: "DATABASE_INVALID_TABLE",
                    status: 500,
                    message:
                        "The database operation could not be completed.",
                };

            case "53300":
                return {
                    code: "DATABASE_CONNECTION_LIMIT",
                    status: 503,
                    message:
                        "The database is temporarily busy. Please try again later.",
                };

            case "57P01":
                return {
                    code: "DATABASE_SHUTDOWN",
                    status: 503,
                    message:
                        "The database is temporarily unavailable. Please try again later.",
                };

            case "08000":
            case "08001":
            case "08003":
            case "08004":
            case "08006":
            case "08007":
            case "08P01":
                return {
                    code: "DATABASE_CONNECTION_ERROR",
                    status: 503,
                    message:
                        "Unable to connect to the database. Please try again later.",
                };

            default:
                return {
                    code: "DATABASE_ERROR",
                    status: 500,
                    message:
                        "A database error occurred. Please try again.",
                };
        }
    }

    if (isTimeoutError(error)) {
        return {
            code: "REQUEST_TIMEOUT",
            status: 504,
            message:
                "The request timed out. Please try again.",
        };
    }

    if (isNetworkError(error)) {
        return {
            code: "NETWORK_ERROR",
            status: 503,
            message:
                "A network error occurred. Please check your connection and try again.",
        };
    }

    if (status) {
        switch (status) {
            case 400:
                return {
                    code: "BAD_REQUEST",
                    status: 400,
                    message:
                        "Invalid request.",
                };

            case 401:
                return {
                    code: "UNAUTHORIZED",
                    status: 401,
                    message:
                        "You are not authorized. Please connect your Gmail account again.",
                };

            case 402:
                return {
                    code: "PAYMENT_REQUIRED",
                    status: 402,
                    message:
                        "This service requires an active subscription or payment.",
                };

            case 403:
                return {
                    code: "FORBIDDEN",
                    status: 403,
                    message:
                        "You do not have permission to perform this action.",
                };

            case 404:
                return {
                    code: "NOT_FOUND",
                    status: 404,
                    message:
                        "The requested resource was not found.",
                };

            case 405:
                return {
                    code: "METHOD_NOT_ALLOWED",
                    status: 405,
                    message:
                        "This operation is not supported.",
                };

            case 408:
                return {
                    code: "REQUEST_TIMEOUT",
                    status: 408,
                    message:
                        "The request timed out. Please try again.",
                };

            case 409:
                return {
                    code: "CONFLICT",
                    status: 409,
                    message:
                        "The request conflicts with existing data.",
                };

            case 410:
                return {
                    code: "RESOURCE_GONE",
                    status: 410,
                    message:
                        "The requested resource is no longer available.",
                };

            case 413:
                return {
                    code: "PAYLOAD_TOO_LARGE",
                    status: 413,
                    message:
                        "The request data is too large.",
                };

            case 415:
                return {
                    code: "UNSUPPORTED_MEDIA_TYPE",
                    status: 415,
                    message:
                        "The provided data format is not supported.",
                };

            case 422:
                return {
                    code: "VALIDATION_ERROR",
                    status: 422,
                    message:
                        "The provided data is invalid.",
                };

            case 423:
                return {
                    code: "RESOURCE_LOCKED",
                    status: 423,
                    message:
                        "The requested resource is currently locked.",
                };

            case 425:
                return {
                    code: "TOO_EARLY",
                    status: 425,
                    message:
                        "The request cannot be processed yet. Please try again.",
                };

            case 429:
                return {
                    code: "RATE_LIMITED",
                    status: 429,
                    message:
                        "Too many requests. Please try again later.",
                };

            case 500:
                return {
                    code: "INTERNAL_SERVER_ERROR",
                    status: 500,
                    message:
                        "Something went wrong on the server. Please try again later.",
                };

            case 501:
                return {
                    code: "NOT_IMPLEMENTED",
                    status: 501,
                    message:
                        "This operation is not supported.",
                };

            case 502:
                return {
                    code: "BAD_GATEWAY",
                    status: 502,
                    message:
                        "An external service returned an invalid response. Please try again later.",
                };

            case 503:
                return {
                    code: "SERVICE_UNAVAILABLE",
                    status: 503,
                    message:
                        "The service is temporarily unavailable. Please try again later.",
                };

            case 504:
                return {
                    code: "GATEWAY_TIMEOUT",
                    status: 504,
                    message:
                        "The external service took too long to respond. Please try again later.",
                };

            default:
                if (status >= 400 && status < 500) {
                    return {
                        code: "CLIENT_ERROR",
                        status,
                        message:
                            "The request could not be completed. Please check your request and try again.",
                    };
                }

                if (status >= 500 && status < 600) {
                    return {
                        code: "SERVER_ERROR",
                        status,
                        message:
                            "The server is temporarily unavailable. Please try again later.",
                    };
                }
        }
    }

    if (message) {
        return {
            code: "INTERNAL_SERVER_ERROR",
            status: 500,
            message:
                "Something went wrong. Please try again later.",
        };
    }

    return {
        code: "INTERNAL_SERVER_ERROR",
        status: 500,
        message:
            "Something went wrong. Please try again later.",
    };
}
