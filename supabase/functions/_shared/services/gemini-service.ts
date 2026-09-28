import { COMPOSE_COACH_PROMPT } from "../prompts/compose-prompt.ts";
import { model } from "./llm-service.ts";
import type { ComposeRequest, CoachingResponse } from "../types/common-types.ts";
import { existingEmailPatterns } from "../repositories/email.repository.ts";
import { ERROR_CODES } from "../errors/error-codes.ts";

export async function analyzeCompose(
    compose: ComposeRequest
): Promise<CoachingResponse> {
    try {
        const emailPatterns = [];
        if (compose.recipients) {
            for (let i = 0; i < compose.recipients.length; i++) {
                const response = await existingEmailPatterns(
                    compose.sender,
                    compose.recipients[i]
                );

                if (response) {
                    emailPatterns.push(response);
                }
            }
        }

        const finalPrompt = `
${COMPOSE_COACH_PROMPT}

CURRENT EMAIL:
${JSON.stringify(
            {
                sender: compose.sender,
                recipients: compose.recipients,
                ccRecipients: compose.ccRecipients,
                subject: compose.subject,
                body: compose.body,
            },
            null,
            2
        )}

RECIPIENT COMMUNICATION PATTERNS:
${JSON.stringify(emailPatterns, null, 2)}
        `.trim();

        const llmResponse = await model.generateContent(finalPrompt);

        if (!llmResponse) {
            throw new Error(ERROR_CODES.LLM_SERVICE_UNAVAILABLE);
        }

        const text = llmResponse.response.text();

        if (!text?.trim()) {
            throw new Error(ERROR_CODES.LLM_RESPONSE_EMPTY);
        }

        const cleaned = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        const finalLlmResponse = JSON.parse(cleaned);

        if (!finalLlmResponse) {
            throw new Error(ERROR_CODES.GEMINI_RESPONSE_PARSE_ERROR);
        }

        return finalLlmResponse;
    } catch (error: any) {
        throw error;
    }
}