import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import { GEMINI_API_KEY } from "../constants.ts";
import { ERROR_CODES } from "../errors/error-codes.ts";

const GEMINI_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
];

function createModel() {
  if (!GEMINI_API_KEY) {
    throw new Error(ERROR_CODES.GEMINI_API_KEY_MISSING);
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  return {
    async generateContent(prompt: string) {
      let lastError: string = ERROR_CODES.GEMINI_REQUEST_FAILED;

      for (const modelName of GEMINI_MODELS) {
        try {
          const geminiModel = genAI.getGenerativeModel({ model: modelName });
          const result = await geminiModel.generateContent(prompt);
          const text = result.response.text();

          if (!text || !text.trim()) {
            throw new Error(ERROR_CODES.GEMINI_RESPONSE_EMPTY);
          }

          console.log("Gemini model used:", modelName);
          return { response: { text: () => text } };
        } catch (error: any) {
          const status: number | undefined = error?.status;
          const message = String(error?.message ?? "").toLowerCase();

          console.error(`Gemini [${modelName}] failed:`, status, message);

          if (status === 400) {
            if (message.includes("api key")) {
              throw new Error(ERROR_CODES.GEMINI_API_KEY_INVALID);
            }
            if (message.includes("token")) {
              throw new Error(ERROR_CODES.GEMINI_TOKEN_LIMIT_EXCEEDED);
            }
            throw new Error(ERROR_CODES.GEMINI_INVALID_REQUEST);
          }

          if (status === 401 || status === 403) {
            throw new Error(ERROR_CODES.GEMINI_AUTH_ERROR);
          }

          if (status === 413) {
            throw new Error(ERROR_CODES.GEMINI_CONTEXT_LENGTH_EXCEEDED);
          }

          if (
            error?.name === "GoogleGenerativeAIResponseError" ||
            message.includes("blocked") ||
            message.includes("safety")
          ) {
            throw new Error(ERROR_CODES.GEMINI_CONTENT_FILTERED);
          }

          if (status === 404) {
            lastError = ERROR_CODES.GEMINI_MODEL_NOT_FOUND;
            continue;
          }

          if (status === 429) {
            lastError = message.includes("quota")
              ? ERROR_CODES.GEMINI_QUOTA_EXCEEDED
              : ERROR_CODES.GEMINI_RATE_LIMIT;
            continue;
          }

          if (status === 408 || status === 504) {
            lastError = ERROR_CODES.GEMINI_TIMEOUT;
            continue;
          }

          if (status === 502 || status === 503) {
            lastError = ERROR_CODES.GEMINI_SERVICE_UNAVAILABLE;
            continue;
          }

          if (status === 500) {
            lastError = ERROR_CODES.GEMINI_API_ERROR;
            continue;
          }

          if (message === ERROR_CODES.GEMINI_RESPONSE_EMPTY.toLowerCase()) {
            lastError = ERROR_CODES.GEMINI_RESPONSE_EMPTY;
            continue;
          }

          if (error instanceof TypeError || message.includes("fetch failed")) {
            lastError = ERROR_CODES.NETWORK_ERROR;
            continue;
          }

          lastError = ERROR_CODES.GEMINI_REQUEST_FAILED;
          continue;
        }
      }

      throw new Error(lastError);
    },
  };
}

export const model = createModel();