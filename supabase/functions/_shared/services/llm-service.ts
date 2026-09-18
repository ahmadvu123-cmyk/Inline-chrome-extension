import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";
import { GEMINI_API_KEY } from "../constants.ts";
import { ERROR_CODES } from "../errors/error-codes.ts";


function createModel() {
    try {
        if (!GEMINI_API_KEY) {
            throw new Error(ERROR_CODES.GEMINI_API_KEY_MISSING)
        }
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
        if (!geminiModel) {
            throw new Error(ERROR_CODES.LLM_MODEL_NOT_FOUND);
        }
        return geminiModel;


    } catch (error: any) {
        console.log("LLM Service error:", error);

        throw error;
    }
}

export const model = createModel();