import { GoogleGenAI, Type } from "@google/genai";
import { MenuData } from "../types";

const processMenuImage = async (base64Image: string): Promise<MenuData | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY not found in environment variables.");
    throw new Error("API Key Missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
            {
                text: `Analyze this menu image. Extract all food and drink items grouped by their category.
                Return a valid JSON object matching this schema:
                {
                    "categories": ["Category Name 1", "Category Name 2"],
                    "items": [
                        { "id": "unique_string", "name": "Item Name", "price": 123, "category": "Category Name 1" }
                    ]
                }.
                Ensure prices are numbers. If a currency symbol is present, ignore it.
                Generate unique IDs for items.`
            },
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Image
                }
            }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                categories: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
                items: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            price: { type: Type.NUMBER },
                            category: { type: Type.STRING }
                        }
                    }
                }
            }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as MenuData;

  } catch (error) {
    console.error("Error parsing menu with Gemini:", error);
    throw error;
  }
};

export const geminiService = {
  processMenuImage
};
