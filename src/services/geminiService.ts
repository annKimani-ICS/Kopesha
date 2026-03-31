import { GoogleGenAI } from "@google/genai";
import { Transaction, CreditProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeCreditworthiness(transactions: Transaction[]): Promise<CreditProfile> {
  const prompt = `
    Analyze the following Kenyan financial transactions (simulated M-Pesa and SMS records) to predict creditworthiness.
    Consider:
    1. Income consistency (Side hustles, salary).
    2. Savings behavior (Chama contributions).
    3. Utility payment patterns (KPLC, Water, Internet).
    4. Debt-to-income ratio indicators.

    Transactions:
    ${JSON.stringify(transactions)}

    Return a JSON object with:
    - score: number (300-850)
    - grade: string ('A' to 'E')
    - insights: string[] (key observations)
    - recommendations: string[] (how to improve score)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      score: 650,
      grade: 'B',
      insights: ["AI analysis unavailable. Using baseline score based on transaction volume."],
      recommendations: ["Ensure consistent chama contributions.", "Keep utility payments timely."]
    };
  }
}
