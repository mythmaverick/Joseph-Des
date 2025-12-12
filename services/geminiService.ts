import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// IMPORTANT: The API key must be available in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a short, fun, catchy, and persuasive product description for a student selling a used "${productName}" in the category "${category}" on a campus marketplace. Keep it under 50 words. Add emojis.`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "This item is in great condition and ready for a new owner!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Great item for sale! Contact me for details.";
  }
};

export const analyzeChatSafety = async (messages: string[]): Promise<{ isSafe: boolean; warning?: string }> => {
  try {
    const model = 'gemini-2.5-flash';
    const conversation = messages.join("\n");
    const prompt = `
      Analyze the following transcript of a buyer-seller conversation on a student marketplace for potential scams or safety risks.
      
      Transcript:
      ${conversation}

      Return a JSON object with:
      1. "isSafe": boolean (true if safe, false if suspicious)
      2. "warning": string (a short warning message for the user if unsafe, or null if safe).
      
      Suspicious things: asking to move to WhatsApp immediately, asking for payment before meeting, aggressive behavior.
    `;

    // Note: In a real app we would use responseSchema, but for simplicity/compatibility we parse text here or assume default text.
    // We will ask for JSON string specifically.
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    if (!text) return { isSafe: true };

    const result = JSON.parse(text);
    return { isSafe: result.isSafe, warning: result.warning };
  } catch (error) {
    // Fail open
    return { isSafe: true };
  }
};
