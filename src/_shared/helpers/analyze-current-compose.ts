import { readCompose } from "@/src/content/gmail/compose-reader";
import { getComposeId } from "./get-compose-id";
import type { CoachingAnalysis } from "../types";
import { showSuggestionBox } from "./show-suggestion-box";

export async function analyzeCurrentCompose(compose: HTMLElement) {
  const data = readCompose(compose, getComposeId(compose), "");

  if (data.body.trim().length < 10) {
    throw new Error("Add at least 10 characters to the email body before analyzing.");
  }

  try {
    const response = await chrome.runtime.sendMessage({
      type: "ANALYZE_COMPOSE",
      payload: data,
    });

    if (!response?.success) {
      throw new Error(response?.error || "Compose analysis failed.");
    }
    const bodyText = data.body.trim();
    showSuggestionBox(compose, response.data as CoachingAnalysis, bodyText);
    console.log("Coaching:", response.data);
    return response.data;
  } catch (error) {
    console.error("Could not send compose analysis:", error);
    throw error;
  }
}