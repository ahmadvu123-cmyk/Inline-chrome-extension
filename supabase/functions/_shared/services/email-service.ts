import { ERROR_CODES } from "../errors/error-codes.ts";
import { saveEmailPatternPrompt } from "../prompts/save-email-patterns.ts";
import { saveEmailPatterns, existingEmails, saveEmails, existingEmailPatterns } from "../repositories/email.repository.ts";
import { model } from "./llm-service.ts";


interface EmailInput {
  user_id: string,
  sender: string,
  receiver: string,
  subject: string,
  date: string,
  labels: string[],
  thread_Id: string,
  email_history_id: string,
  email_message: string
}
export async function generateEmailPatterns(emailsData: unknown) {
    try {
        console.log(
            "Emails Data in Generate email pattern:",
            emailsData
        );

        const finalPrompt = `
            ${saveEmailPatternPrompt}

            Mailbox data (JSON):
            ${JSON.stringify(emailsData)}
        `;

        const result = await model.generateContent(finalPrompt);

        if (!result) {
            throw new Error(
                ERROR_CODES.LLM_SERVICE_UNAVAILABLE
            );
        }

        const response = await result.response;

        const responseText = response.text();

        if (!responseText?.trim()) {
            throw new Error(
                ERROR_CODES.GEMINI_RESPONSE_EMPTY
            );
        }

        console.log(
            "Final response from LLM:",
            responseText
        );

        let parsedResponse: unknown;

        try {
            parsedResponse = JSON.parse(responseText);
        } catch (error) {
            console.error(
                "Gemini response JSON parse error:",
                error
            );

            throw new Error(
                ERROR_CODES.GEMINI_RESPONSE_PARSE_ERROR
            );
        }

        /**
         * Expected Gemini response:
         *
         * {
         *   "patterns": [
         *     {
         *       "sender": {
         *         "email": "a@example.com"
         *       },
         *       "receiver": {
         *         "email": "b@example.com"
         *       },
         *       "response": {}
         *     }
         *   ]
         * }
         */

        if (
            !parsedResponse ||
            typeof parsedResponse !== "object" ||
            !("patterns" in parsedResponse)
        ) {
            throw new Error(
                ERROR_CODES.GEMINI_RESPONSE_PARSE_ERROR
            );
        }

        const patterns = (
            parsedResponse as {
                patterns?: unknown;
            }
        ).patterns;

        if (!Array.isArray(patterns)) {
            throw new Error(
                ERROR_CODES.GEMINI_RESPONSE_PARSE_ERROR
            );
        }

        if (patterns.length === 0) {
            throw new Error(
                ERROR_CODES.GEMINI_RESPONSE_EMPTY
            );
        }

        const savedPatterns = [];
        const skippedPatterns = [];

        /**
         * Process every sender -> receiver pair.
         */
        for (const pattern of patterns) {

            if (
                !pattern ||
                typeof pattern !== "object"
            ) {
                console.warn(
                    "Skipping invalid pattern:",
                    pattern
                );

                continue;
            }

            const patternData = pattern as {
                sender?: {
                    email?: string;
                };
                receiver?: {
                    email?: string;
                };
                response?: unknown;
            };

            const sender =
                patternData.sender?.email
                    ?.trim()
                    .toLowerCase();

            const receiver =
                patternData.receiver?.email
                    ?.trim()
                    .toLowerCase();

            const patternResponse =
                patternData.response;

            /**
             * Validate sender.
             */
            if (!sender) {
                console.warn(
                    "Skipping pattern because sender is missing:",
                    pattern
                );

                continue;
            }

            /**
             * Validate receiver.
             */
            if (!receiver) {
                console.warn(
                    "Skipping pattern because receiver is missing:",
                    pattern
                );

                continue;
            }

            /**
             * Validate response.
             */
            if (
                patternResponse === undefined ||
                patternResponse === null
            ) {
                console.warn(
                    "Skipping pattern because response is missing:",
                    {
                        sender,
                        receiver,
                    }
                );

                continue;
            }

            console.log(
                `Checking pattern: ${sender} -> ${receiver}`
            );

            /**
             * Check database.
             */
            const existingPattern =
                await existingEmailPatterns(
                    sender,
                    receiver
                );

            /**
             * Already exists.
             * Do NOT insert it again.
             */
            if (existingPattern) {
                console.log(
                    `Pattern already exists: ${sender} -> ${receiver}`
                );

                skippedPatterns.push({
                    sender,
                    receiver,
                    reason: "ALREADY_EXISTS",
                });

                continue;
            }

            /**
             * Pattern does not exist.
             * Insert it into database.
             */
            const savedPattern =
                await saveEmailPatterns({
                    sender,
                    receiver,
                    response: patternResponse,
                });

            if (!savedPattern) {
                throw new Error(
                    ERROR_CODES.SUPABASE_INSERT_FAILED
                );
            }

            console.log(
                `Pattern saved: ${sender} -> ${receiver}`
            );

            savedPatterns.push(savedPattern);
        }

        return {
            success: true,

            totalPatterns: patterns.length,

            savedCount: savedPatterns.length,

            skippedCount: skippedPatterns.length,

            savedPatterns,

            skippedPatterns,
        };

    } catch (error) {
        console.error(
            "Failed to generate email patterns:",
            error
        );

        throw error;
    }
}
export async function checkExistingEmails(userEmail: string) {
  return await existingEmails(userEmail);
}

export async function checkSaveEmails(emails: EmailInput[]) {
  return await saveEmails(emails);
}