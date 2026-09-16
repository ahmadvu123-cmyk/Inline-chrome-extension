import { saveEmailPatternPrompt } from "../prompts/save-email-patterns.ts";
import { saveEmailPatterns } from "../repositories/email.repository.ts";
import { model } from "./llm-service.ts";

export async function generateEmailPatterns(emailsData: unknown) {
  try {
    console.log("Emails Data in Generate email pattern:", emailsData);

    const finalPrompt = `
      ${saveEmailPatternPrompt}

      Mailbox data (JSON):
      ${JSON.stringify(emailsData)}
    `;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;

    const responseText = response.text();

    console.log("Final response from LLM:", responseText);
    console.log("Final response type from LLM:", typeof responseText);

    // Convert JSON string → JavaScript object
    const patterns = JSON.parse(responseText);

    const { sender, receiver, response: patternResponse } = patterns;

    console.log("Sender:", sender);
    console.log("Receiver:", receiver);
    console.log("Pattern response:", patternResponse);

    await saveEmailPatterns({
      sender,
      receiver,
      response: patternResponse,
    });

    return patterns;
  } catch (error) {
    console.error("Failed to generate email patterns:", error);

    throw error;
  }
}