import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";
import { GEMINI_API_KEY } from "../constants.ts";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
export const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });