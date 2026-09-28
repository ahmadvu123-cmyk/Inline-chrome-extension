import { ERROR_CODES } from "../errors/error-codes.ts";
import type { ComposeRequest } from "../types/common-types.ts";

export function validateCompose(body: any): ComposeRequest {
  if (!body || typeof body !== "object") {
    throw new Error(ERROR_CODES.BAD_REQUEST || "INVALID_BODY");
  }

  if (!body.composeId || typeof body.composeId !== "string") {
    throw new Error(ERROR_CODES.MISSING_REQUIRED_FIELD);
  }

  return body as ComposeRequest;
}