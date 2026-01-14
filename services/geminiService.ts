import { GoogleGenAI, Type } from "@google/genai";
import { NutritionResult, FoodItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes a meal image using Gemini to extract precise nutritional information.
 * @param base64Image The base64 encoded image string.
 */
export async function analyzeMealImage(base64Image: string): Promise<NutritionResult> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "Identify all food items in this image. Estimate the volume/weight (e.g. 150g) of each item based on visual cues. Calculate calories, protein, carbs, and fat for each item. Be specific about preparation (e.g. fried vs grilled). Cross-reference with standard nutritional databases.",
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mealName: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            description: { type: Type.STRING },
            detailedFoods: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  carbs: { type: Type.NUMBER },
                  fat: { type: Type.NUMBER },
                },
                required: ["name", "quantity", "calories", "protein", "carbs", "fat"],
              },
            },
          },
          required: ["mealName", "calories", "protein", "carbs", "fat", "description", "detailedFoods"],
        },
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("Could not parse image data.");
    
    const data = JSON.parse(jsonStr);

    return {
      mealName: data.mealName,
      calories: Math.round(data.calories),
      protein: Number(data.protein.toFixed(1)),
      carbs: Number(data.carbs.toFixed(1)),
      fat: Number(data.fat.toFixed(1)),
      ingredients: data.detailedFoods.map((f: any) => f.name),
      description: data.description,
      detailedFoods: data.detailedFoods,
    };
  } catch (error) {
    console.error("Analysis failure:", error);
    throw new Error("Unable to analyze meal. Please ensure the plate is clearly visible and centered.");
  }
}