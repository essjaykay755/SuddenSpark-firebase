import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function checkContentWithGemini(
  content: string
): Promise<{ isValid: boolean; reason: string }> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Analyze the following content and determine if it's appropriate for a public thought-sharing platform:
    "${content}"
    
    Respond with a JSON object containing two fields:
    1. "isValid": a boolean indicating if the content is appropriate (true) or not (false)
    2. "reason": a brief explanation of why the content is or isn't appropriate
    
    Consider the following criteria:
    - The content should not be gibberish or nonsensical
    - It should not contain explicit, offensive, or harmful language
    - It should be a coherent thought or idea
    
    Respond only with the JSON object, no other text or code block formatting.
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  try {
    // Remove any potential code block formatting
    const cleanedText = text.replace(/```json\n|\n```/g, "").trim();
    const parsedResponse = JSON.parse(cleanedText);
    return {
      isValid: parsedResponse.isValid,
      reason: parsedResponse.reason,
    };
  } catch (error) {
    console.error("Error parsing Gemini API response:", error);
    console.error("Raw response:", text);
    return {
      isValid: false,
      reason: "An error occurred while checking the content. Please try again.",
    };
  }
}
