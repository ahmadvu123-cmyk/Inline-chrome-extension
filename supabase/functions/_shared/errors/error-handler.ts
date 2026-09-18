import { ERROR_CODES, type ErrorCode } from "./error-codes.ts";

export interface NormalizedError {
    code: ErrorCode;
    status: number;
    message: string;
}

const ERROR_DETAILS: Record<ErrorCode, { status: number; message: string }> = {
    [ERROR_CODES.UNAUTHORIZED]: {
        status: 401,
        message: "Authentication is required to access this resource.",
    },

    [ERROR_CODES.FORBIDDEN]: {
        status: 403,
        message: "You are authenticated, but you do not have permission to perform this operation.",
    },

    [ERROR_CODES.INVALID_TOKEN]: {
        status: 401,
        message: "The authentication token provided with the request is invalid or malformed.",
    },

    [ERROR_CODES.TOKEN_EXPIRED]: {
        status: 401,
        message: "The authentication token has expired. Please authenticate again to continue.",
    },

    [ERROR_CODES.ACCESS_TOKEN_MISSING]: {
        status: 401,
        message: "The required access token was not provided with the request.",
    },

    [ERROR_CODES.REFRESH_TOKEN_MISSING]: {
        status: 401,
        message: "The required refresh token was not provided, so a new access token cannot be generated.",
    },

    [ERROR_CODES.INVALID_CREDENTIALS]: {
        status: 401,
        message: "The provided authentication credentials are invalid. Please verify your credentials and try again.",
    },

    [ERROR_CODES.GMAIL_ACCESS_TOKEN_MISSING]: {
        status: 401,
        message: "The Gmail access token is missing. Please reconnect your Google account and grant the required Gmail permissions.",
    },

    [ERROR_CODES.GMAIL_ACCESS_TOKEN_INVALID]: {
        status: 401,
        message: "The Gmail access token is invalid or cannot be used to access the connected Gmail account.",
    },

    [ERROR_CODES.GMAIL_ACCESS_TOKEN_EXPIRED]: {
        status: 401,
        message: "The Gmail access token has expired. Please reconnect your Google account to obtain a new access token.",
    },

    [ERROR_CODES.GMAIL_AUTH_FAILED]: {
        status: 401,
        message: "Gmail authentication failed while attempting to access the connected Google account.",
    },

    [ERROR_CODES.GMAIL_PERMISSION_DENIED]: {
        status: 403,
        message: "Gmail denied permission to access the requested data. Please grant the required Gmail permissions and try again.",
    },

    [ERROR_CODES.GMAIL_API_ERROR]: {
        status: 502,
        message: "The Gmail API returned an unexpected error while processing the request.",
    },

    [ERROR_CODES.GMAIL_API_RATE_LIMIT]: {
        status: 429,
        message: "The Gmail API rate limit has been exceeded. Please wait before making another Gmail API request.",
    },

    [ERROR_CODES.GMAIL_QUOTA_EXCEEDED]: {
        status: 429,
        message: "The Gmail API usage quota has been exceeded. Gmail operations cannot continue until the quota becomes available.",
    },

    [ERROR_CODES.GMAIL_MESSAGE_NOT_FOUND]: {
        status: 404,
        message: "The requested Gmail message could not be found. It may have been deleted or is no longer accessible.",
    },

    [ERROR_CODES.GMAIL_THREAD_NOT_FOUND]: {
        status: 404,
        message: "The requested Gmail thread could not be found. It may have been deleted or is no longer accessible.",
    },

    [ERROR_CODES.GMAIL_PROFILE_FETCH_FAILED]: {
        status: 502,
        message: "The Gmail profile could not be retrieved from the Gmail API. Please verify the Gmail connection and try again.",
    },

    [ERROR_CODES.GMAIL_MESSAGES_FETCH_FAILED]: {
        status: 502,
        message: "Gmail messages could not be retrieved from the Gmail API. The Gmail service may be temporarily unavailable.",
    },

    [ERROR_CODES.GMAIL_THREADS_FETCH_FAILED]: {
        status: 502,
        message: "Gmail threads could not be retrieved from the Gmail API. Please verify the Gmail connection and try synchronization again.",
    },

    [ERROR_CODES.GMAIL_SYNC_FAILED]: {
        status: 502,
        message: "Gmail synchronization could not be completed because one or more Gmail API operations failed.",
    },

    [ERROR_CODES.USER_NOT_FOUND]: {
        status: 404,
        message: "The requested user could not be found. The user may not have been registered or may have been removed.",
    },

    [ERROR_CODES.USER_ALREADY_EXISTS]: {
        status: 409,
        message: "A user with the provided account information already exists in the system.",
    },

    [ERROR_CODES.USER_CREATION_FAILED]: {
        status: 500,
        message: "The user account could not be created because an unexpected server or database error occurred.",
    },

    [ERROR_CODES.USER_UPDATE_FAILED]: {
        status: 500,
        message: "The user information could not be updated because an unexpected server or database error occurred.",
    },

    [ERROR_CODES.USER_DELETE_FAILED]: {
        status: 500,
        message: "The user account could not be deleted because an unexpected server or database error occurred.",
    },

    [ERROR_CODES.VALIDATION_ERROR]: {
        status: 400,
        message: "The request contains invalid or incomplete data and could not pass validation.",
    },

    [ERROR_CODES.INVALID_REQUEST]: {
        status: 400,
        message: "The request is invalid or contains data that cannot be processed by the server.",
    },

    [ERROR_CODES.INVALID_INPUT]: {
        status: 400,
        message: "One or more provided input values are invalid or use an unsupported format.",
    },

    [ERROR_CODES.MISSING_REQUIRED_FIELD]: {
        status: 400,
        message: "One or more required fields are missing from the request.",
    },

    [ERROR_CODES.INVALID_EMAIL]: {
        status: 400,
        message: "The provided email address is invalid or does not match the expected email format.",
    },

    [ERROR_CODES.INVALID_UUID]: {
        status: 400,
        message: "The provided identifier is not a valid UUID and cannot be used to identify the requested resource.",
    },

    [ERROR_CODES.INVALID_ID]: {
        status: 400,
        message: "The provided resource identifier is invalid or does not match the expected format.",
    },

    [ERROR_CODES.EMAILS_ALREADY_EXISTS]: {
        status: 409,
        message: "Email records for this user already exist in the database, so the requested email data cannot be created again.",
    },

    [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: {
        status: 409,
        message: "The requested resource already exists and cannot be created again with the same identifier or unique values.",
    },

    [ERROR_CODES.CONFLICT_ERROR]: {
        status: 409,
        message: "The request could not be completed because it conflicts with the current state or existing data.",
    },

    [ERROR_CODES.DUPLICATE_RECORD]: {
        status: 409,
        message: "The requested record already exists and creating another record with the same unique values is not allowed.",
    },

    [ERROR_CODES.BAD_REQUEST]: {
        status: 400,
        message: "The server could not process the request because the request data or parameters are invalid.",
    },

    [ERROR_CODES.NOT_FOUND]: {
        status: 404,
        message: "The requested resource could not be found or may no longer exist.",
    },

    [ERROR_CODES.METHOD_NOT_ALLOWED]: {
        status: 405,
        message: "The HTTP method used for this endpoint is not supported. Please use a supported request method.",
    },

    [ERROR_CODES.NOT_ACCEPTABLE]: {
        status: 406,
        message: "The server cannot provide a response in a format accepted by the client.",
    },

    [ERROR_CODES.REQUEST_TIMEOUT]: {
        status: 408,
        message: "The request took too long to complete and was terminated by the server.",
    },

    [ERROR_CODES.TOO_MANY_REQUESTS]: {
        status: 429,
        message: "Too many requests were received within a short period. Please wait and try again later.",
    },

    [ERROR_CODES.PAYLOAD_TOO_LARGE]: {
        status: 413,
        message: "The request payload is larger than the maximum size allowed by the server.",
    },

    [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
        status: 500,
        message: "An unexpected internal server error occurred while processing the request. Please try again later.",
    },

    [ERROR_CODES.SERVICE_UNAVAILABLE]: {
        status: 503,
        message: "The service is temporarily unavailable and cannot process the request. Please try again later.",
    },

    [ERROR_CODES.SERVER_TIMEOUT]: {
        status: 504,
        message: "The server did not receive a response from a required service within the allowed time.",
    },

    [ERROR_CODES.SERVER_CONFIGURATION_ERROR]: {
        status: 500,
        message: "The server is incorrectly configured and cannot complete the requested operation.",
    },

    [ERROR_CODES.ENVIRONMENT_VARIABLE_MISSING]: {
        status: 500,
        message: "A required server environment variable is missing or has not been configured correctly.",
    },

    [ERROR_CODES.DEPENDENCY_ERROR]: {
        status: 500,
        message: "A required internal dependency failed while processing the request.",
    },

    [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: {
        status: 502,
        message: "An external service required to complete the request returned an error or could not be reached.",
    },

    [ERROR_CODES.SUPABASE_ERROR]: {
        status: 500,
        message: "Supabase returned an unexpected error while processing the requested operation.",
    },

    [ERROR_CODES.SUPABASE_AUTH_ERROR]: {
        status: 401,
        message: "Supabase authentication failed while validating the current user session or authentication credentials.",
    },

    [ERROR_CODES.SUPABASE_AUTH_FAILED]: {
        status: 401,
        message: "Supabase could not authenticate the current request. Please verify the authentication credentials and try again.",
    },

    [ERROR_CODES.SUPABASE_SESSION_NOT_FOUND]: {
        status: 401,
        message: "No active Supabase authentication session was found for the current request.",
    },

    [ERROR_CODES.SUPABASE_PERMISSION_DENIED]: {
        status: 403,
        message: "Supabase denied access to the requested resource because the current user does not have the required permissions.",
    },

    [ERROR_CODES.SUPABASE_INVALID_TOKEN]: {
        status: 401,
        message: "The Supabase authentication token is invalid or could not be verified.",
    },

    [ERROR_CODES.SUPABASE_TOKEN_EXPIRED]: {
        status: 401,
        message: "The Supabase authentication token has expired. Please authenticate again to obtain a valid session.",
    },

    [ERROR_CODES.SUPABASE_QUERY_FAILED]: {
        status: 500,
        message: "The Supabase database query could not be completed successfully.",
    },

    [ERROR_CODES.SUPABASE_INSERT_FAILED]: {
        status: 500,
        message: "The requested data could not be inserted into Supabase because the database operation failed.",
    },

    [ERROR_CODES.SUPABASE_UPDATE_FAILED]: {
        status: 500,
        message: "The requested data could not be updated in Supabase because the database operation failed.",
    },

    [ERROR_CODES.SUPABASE_DELETE_FAILED]: {
        status: 500,
        message: "The requested data could not be deleted from Supabase because the database operation failed.",
    },

    [ERROR_CODES.SUPABASE_RPC_FAILED]: {
        status: 500,
        message: "The requested Supabase database function could not be executed successfully.",
    },

    [ERROR_CODES.SUPABASE_STORAGE_ERROR]: {
        status: 500,
        message: "The Supabase Storage operation failed while attempting to access, upload, update, or delete a stored file.",
    },

    [ERROR_CODES.SUPABASE_RATE_LIMIT]: {
        status: 429,
        message: "The Supabase API rate limit has been exceeded. Please wait before sending additional requests.",
    },

    [ERROR_CODES.DATABASE_ERROR]: {
        status: 500,
        message: "An unexpected database error occurred while processing the requested operation.",
    },

    [ERROR_CODES.DATABASE_CONNECTION_ERROR]: {
        status: 503,
        message: "The application could not establish a connection to the database. Please try again later.",
    },

    [ERROR_CODES.DATABASE_QUERY_ERROR]: {
        status: 500,
        message: "The database could not successfully execute the requested query.",
    },

    [ERROR_CODES.DATABASE_TRANSACTION_ERROR]: {
        status: 500,
        message: "The database transaction could not be completed successfully and the requested changes were not applied.",
    },

    [ERROR_CODES.DATABASE_TIMEOUT]: {
        status: 504,
        message: "The database operation exceeded the allowed execution time and was terminated.",
    },

    [ERROR_CODES.DATABASE_CONSTRAINT_ERROR]: {
        status: 400,
        message: "The database rejected the operation because it violated one or more database constraints.",
    },

    [ERROR_CODES.DATABASE_UNIQUE_CONSTRAINT_ERROR]: {
        status: 409,
        message: "The database rejected the operation because a record with the same unique value already exists.",
    },

    [ERROR_CODES.DATABASE_FOREIGN_KEY_ERROR]: {
        status: 400,
        message: "The database rejected the operation because the referenced record does not exist or cannot be referenced.",
    },

    [ERROR_CODES.DATABASE_NOT_NULL_ERROR]: {
        status: 400,
        message: "The database rejected the operation because a required field was not provided.",
    },

    [ERROR_CODES.DATABASE_RECORD_NOT_FOUND]: {
        status: 404,
        message: "The requested database record could not be found or may have already been removed.",
    },

    [ERROR_CODES.DATABASE_DUPLICATE_RECORD]: {
        status: 409,
        message: "The database rejected the operation because an equivalent record already exists.",
    },

    [ERROR_CODES.LLM_ERROR]: {
        status: 502,
        message: "An unexpected error occurred while communicating with the configured large language model service.",
    },

    [ERROR_CODES.LLM_API_ERROR]: {
        status: 502,
        message: "The configured LLM provider returned an error while processing the requested AI operation.",
    },

    [ERROR_CODES.LLM_AUTH_ERROR]: {
        status: 401,
        message: "Authentication with the configured LLM provider failed. Please verify the provider credentials and configuration.",
    },

    [ERROR_CODES.LLM_API_KEY_MISSING]: {
        status: 500,
        message: "The LLM API key is missing from the server configuration and the AI request cannot be processed.",
    },

    [ERROR_CODES.LLM_API_KEY_INVALID]: {
        status: 401,
        message: "The configured LLM API key is invalid or unauthorized. Please verify the API credentials.",
    },

    [ERROR_CODES.LLM_MODEL_NOT_FOUND]: {
        status: 404,
        message: "The requested LLM model could not be found or is not available for the configured provider.",
    },

    [ERROR_CODES.LLM_REQUEST_FAILED]: {
        status: 502,
        message: "The LLM request failed before a valid AI response could be received.",
    },

    [ERROR_CODES.LLM_RESPONSE_INVALID]: {
        status: 502,
        message: "The LLM returned a response that does not match the expected response format and could not be processed safely.",
    },

    [ERROR_CODES.LLM_RESPONSE_EMPTY]: {
        status: 502,
        message: "The LLM request completed, but the provider returned an empty response instead of the expected AI-generated content.",
    },

    [ERROR_CODES.LLM_RESPONSE_PARSE_ERROR]: {
        status: 502,
        message: "The LLM response was received but could not be parsed into the expected application format.",
    },

    [ERROR_CODES.LLM_RATE_LIMIT]: {
        status: 429,
        message: "The configured LLM provider rate limit has been exceeded. Please wait before sending another AI request.",
    },

    [ERROR_CODES.LLM_QUOTA_EXCEEDED]: {
        status: 429,
        message: "The configured LLM provider quota has been exceeded. Additional AI requests cannot be processed until quota becomes available.",
    },

    [ERROR_CODES.LLM_REQUEST_TIMEOUT]: {
        status: 504,
        message: "The LLM request exceeded the configured timeout and did not complete within the allowed time.",
    },

    [ERROR_CODES.LLM_CONTEXT_LENGTH_EXCEEDED]: {
        status: 400,
        message: "The input provided to the LLM exceeds the model's supported context length. Reduce the amount of input data and try again.",
    },

    [ERROR_CODES.LLM_TOKEN_LIMIT_EXCEEDED]: {
        status: 400,
        message: "The LLM request exceeds the allowed token limit. Reduce the input or requested output size and try again.",
    },

    [ERROR_CODES.LLM_CONTENT_FILTERED]: {
        status: 400,
        message: "The LLM provider rejected or filtered the request because the submitted content did not meet its content requirements.",
    },

    [ERROR_CODES.LLM_INVALID_REQUEST]: {
        status: 400,
        message: "The LLM request contains invalid parameters or unsupported input and could not be processed by the provider.",
    },

    [ERROR_CODES.LLM_SERVICE_UNAVAILABLE]: {
        status: 503,
        message: "The configured LLM service is temporarily unavailable. Please try the AI operation again later.",
    },

    [ERROR_CODES.GEMINI_ERROR]: {
        status: 502,
        message: "An unexpected error occurred while communicating with the Google Gemini AI service.",
    },

    [ERROR_CODES.GEMINI_API_ERROR]: {
        status: 502,
        message: "The Gemini API returned an error while processing the requested AI operation.",
    },

    [ERROR_CODES.GEMINI_AUTH_ERROR]: {
        status: 401,
        message: "Gemini authentication failed because the configured credentials are invalid, expired, or unauthorized.",
    },

    [ERROR_CODES.GEMINI_API_KEY_MISSING]: {
        status: 500,
        message: "The Gemini API key is missing from the server configuration and the Gemini request cannot be processed.",
    },

    [ERROR_CODES.GEMINI_API_KEY_INVALID]: {
        status: 401,
        message: "The configured Gemini API key is invalid or unauthorized. Please verify the Gemini API credentials.",
    },

    [ERROR_CODES.GEMINI_RATE_LIMIT]: {
        status: 429,
        message: "The Gemini API rate limit has been exceeded. Please wait before sending another Gemini request.",
    },

    [ERROR_CODES.GEMINI_QUOTA_EXCEEDED]: {
        status: 429,
        message: "The Gemini API quota has been exceeded. Additional Gemini requests cannot be processed until quota becomes available.",
    },

    [ERROR_CODES.GEMINI_MODEL_NOT_FOUND]: {
        status: 404,
        message: "The requested Gemini model could not be found or is not available for the configured API.",
    },

    [ERROR_CODES.GEMINI_REQUEST_FAILED]: {
        status: 502,
        message: "The request to the Gemini AI service failed before a valid response could be received.",
    },

    [ERROR_CODES.GEMINI_RESPONSE_INVALID]: {
        status: 502,
        message: "Gemini returned a response that does not match the expected response format and could not be processed safely.",
    },

    [ERROR_CODES.GEMINI_RESPONSE_EMPTY]: {
        status: 502,
        message: "Gemini completed the request but returned an empty response instead of the expected AI-generated content.",
    },

    [ERROR_CODES.GEMINI_RESPONSE_PARSE_ERROR]: {
        status: 502,
        message: "The Gemini response was received but could not be parsed into the expected application format.",
    },

    [ERROR_CODES.GEMINI_CONTEXT_LENGTH_EXCEEDED]: {
        status: 400,
        message: "The input provided to Gemini exceeds the model's supported context length. Reduce the input data and try again.",
    },

    [ERROR_CODES.GEMINI_TOKEN_LIMIT_EXCEEDED]: {
        status: 400,
        message: "The Gemini request exceeds the allowed token limit. Reduce the input or requested output size and try again.",
    },

    [ERROR_CODES.GEMINI_CONTENT_FILTERED]: {
        status: 400,
        message: "Gemini rejected or filtered the request because the submitted content did not meet the provider's content requirements.",
    },

    [ERROR_CODES.GEMINI_INVALID_REQUEST]: {
        status: 400,
        message: "The Gemini request contains invalid parameters or unsupported input and could not be processed.",
    },

    [ERROR_CODES.GEMINI_SERVICE_UNAVAILABLE]: {
        status: 503,
        message: "The Gemini AI service is temporarily unavailable. Please try the AI operation again later.",
    },

    [ERROR_CODES.GEMINI_TIMEOUT]: {
        status: 504,
        message: "The Gemini AI request exceeded the configured timeout and did not complete within the allowed time.",
    },

    [ERROR_CODES.NETWORK_ERROR]: {
        status: 502,
        message: "A network error occurred while communicating with a required internal or external service.",
    },

    [ERROR_CODES.NETWORK_TIMEOUT]: {
        status: 504,
        message: "The network request exceeded the configured timeout and did not receive a response within the allowed time.",
    },

    [ERROR_CODES.CONNECTION_REFUSED]: {
        status: 503,
        message: "The target service refused the network connection and could not process the request.",
    },

    [ERROR_CODES.CONNECTION_RESET]: {
        status: 502,
        message: "The network connection was unexpectedly reset before the request could be completed.",
    },

    [ERROR_CODES.DNS_ERROR]: {
        status: 502,
        message: "The requested service hostname could not be resolved through DNS.",
    },

    [ERROR_CODES.JSON_PARSE_ERROR]: {
        status: 400,
        message: "The server could not parse the provided JSON because the payload contains invalid JSON syntax.",
    },

    [ERROR_CODES.INVALID_JSON]: {
        status: 400,
        message: "The request body contains invalid JSON and could not be processed.",
    },

    [ERROR_CODES.RESPONSE_PARSE_ERROR]: {
        status: 502,
        message: "The response received from an external service could not be parsed into the expected application format.",
    },

    [ERROR_CODES.RESOURCE_NOT_FOUND]: {
        status: 404,
        message: "The requested resource could not be found or may no longer exist.",
    },

    [ERROR_CODES.RESOURCE_UPDATE_FAILED]: {
        status: 500,
        message: "The requested resource could not be updated because the underlying operation failed.",
    },

    [ERROR_CODES.RESOURCE_DELETE_FAILED]: {
        status: 500,
        message: "The requested resource could not be deleted because the underlying operation failed.",
    },

    [ERROR_CODES.UNKNOWN_ERROR]: {
        status: 500,
        message: "An unexpected error occurred and the application could not determine the specific cause of the failure.",
    },
};

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return "";
}

export function handleError(error: unknown): NormalizedError {
    console.error("Original error:", error);

    const errorMessage = getErrorMessage(error);

    const errorCode = Object.values(ERROR_CODES).includes(
        errorMessage as ErrorCode,
    )
        ? (errorMessage as ErrorCode)
        : ERROR_CODES.INTERNAL_SERVER_ERROR;

    const errorConfig = ERROR_DETAILS[errorCode];

    return {
        code: errorCode,
        status: errorConfig.status,
        message: errorConfig.message,
    };
}

