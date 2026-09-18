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
    console.log("Emails Data in Generate email pattern:", emailsData);

    const finalPrompt = `
      ${saveEmailPatternPrompt}

      Mailbox data (JSON):
      ${JSON.stringify(emailsData)}
    `;

    const result = await model.generateContent(finalPrompt);
    if (!result) {
      throw new Error(ERROR_CODES.LLM_SERVICE_UNAVAILABLE)
    }
    const response = await result.response;

    const responseText = response.text();

    if (!responseText?.trim()) {
      throw new Error(ERROR_CODES.GEMINI_RESPONSE_EMPTY);
    }

    console.log("Final response from LLM:", responseText);
    console.log("Final response type from LLM:", typeof responseText);

    // Convert JSON string → JavaScript object
    let patterns
    try {
      patterns = JSON.parse(responseText);
    } catch (error) {
      throw new Error(ERROR_CODES.GEMINI_RESPONSE_PARSE_ERROR);

    }

    const { sender, receiver, response: patternResponse } = patterns;

    console.log("Sender:", sender);
    console.log("Receiver:", receiver);
    console.log("Pattern response:", patternResponse);

    const checkExistingEmailPatterns = await existingEmailPatterns(sender, receiver);
    if(checkExistingEmailPatterns){
      throw new Error(ERROR_CODES.CONFLICT_ERROR);
    }

    const emailRepsonse = await saveEmailPatterns({
      sender,
      receiver,
      response: patternResponse,
    });
    if (!emailRepsonse) {
      throw new Error(ERROR_CODES.SUPABASE_INSERT_FAILED)
    }

    return patterns;
  } catch (error) {
    console.error("Failed to generate email patterns:", error);

    throw error;
  }
}

export async function checkExistingEmails(userEmail: string) {
  return await existingEmails(userEmail);
}

export async function checkSaveEmails(emails: EmailInput[]) {
  return await saveEmails(emails);
}