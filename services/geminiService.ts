
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const searchSchema = {
  type: Type.OBJECT,
  properties: {
    city: {
      type: Type.STRING,
      description: "La ciudad que el usuario quiere buscar. Por ejemplo, 'Madrid', 'Barcelona'.",
    },
    amenities: {
      type: Type.ARRAY,
      description: "Una lista de servicios que el usuario solicita. Valores posibles: 'wifi', 'café', 'sala de reuniones', 'parking', 'acceso 24/7', 'escritorio de pie'.",
      items: {
        type: Type.STRING,
      },
    },
  },
};

export interface ParsedSearchQuery {
    city?: string;
    amenities?: string[];
}

export const getStructuredSearchQuery = async (prompt: string): Promise<ParsedSearchQuery> => {
  try {
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analiza la siguiente petición de un usuario para encontrar un espacio de coworking y extrae los criterios de búsqueda. Petición: "${prompt}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: searchSchema,
        }
    });
    
    const responseText = result.text.trim();
    if (!responseText) {
        console.error("Gemini API returned an empty response.");
        return {};
    }

    const parsedResponse = JSON.parse(responseText);
    return parsedResponse as ParsedSearchQuery;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Return empty object on error to allow fallback to manual search
    return {};
  }
};
