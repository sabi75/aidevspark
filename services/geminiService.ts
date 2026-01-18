
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_PROMPT = `You are an expert full-stack web developer and UI/UX designer.
Your goal is to generate high-quality, responsive, and modern web applications based on a user's description.
Use Tailwind CSS (CDN: https://cdn.tailwindcss.com) for styling whenever possible to ensure a professional look.
Provide the output as a JSON object with 'html', 'css', and 'js' keys.
The 'html' should contain the body content (and any head links needed like Google Fonts).
The 'css' should contain any custom styles not covered by Tailwind.
The 'js' should contain the interactive logic.
The 'fullHtml' should be a complete, self-contained HTML file that combines everything.

IMPORTANT:
1. Ensure the UI is modern (good spacing, typography, contrast).
2. Include placeholder images using picsum.photos if needed.
3. Make the app fully functional based on the prompt.
4. Avoid any external dependencies other than Tailwind and Google Fonts.
`;

export const generateAppCode = async (prompt: string): Promise<GeneratedCode> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            html: { type: Type.STRING },
            css: { type: Type.STRING },
            js: { type: Type.STRING },
            fullHtml: { type: Type.STRING },
          },
          required: ["html", "css", "js", "fullHtml"],
        },
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as GeneratedCode;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate application code. Please try again.");
  }
};
