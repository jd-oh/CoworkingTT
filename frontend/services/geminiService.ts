
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

const assistantSchema = {
  type: Type.OBJECT,
  properties: {
    action: {
      type: Type.STRING,
      description: "Acción que el usuario quiere realizar: 'search', 'book', 'help', 'unknown'",
    },
    spaceName: {
      type: Type.STRING,
      description: "Nombre del espacio de coworking mencionado",
    },
    date: {
      type: Type.STRING,
      description: "Fecha mencionada en formato YYYY-MM-DD",
    },
    city: {
      type: Type.STRING,
      description: "Ciudad mencionada para búsqueda",
    },
    amenities: {
      type: Type.ARRAY,
      description: "Servicios mencionados",
      items: {
        type: Type.STRING,
      },
    },
    message: {
      type: Type.STRING,
      description: "Mensaje de respuesta para el usuario",
    },
  },
};

export interface ParsedSearchQuery {
    city?: string;
    amenities?: string[];
}

export interface AssistantResponse {
  action: 'search' | 'book' | 'help' | 'unknown';
  spaceName?: string;
  date?: string;
  city?: string;
  amenities?: string[];
  message: string;
}

export const getStructuredSearchQuery = async (prompt: string): Promise<ParsedSearchQuery> => {
  try {
    console.log("Calling Gemini API with prompt:", prompt);
    console.log("API Key available:", !!process.env.API_KEY);
    
    // Temporary timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API timeout')), 10000); // 10 second timeout
    });
    
    const apiCall = ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Analiza la siguiente petición de un usuario para encontrar un espacio de coworking y extrae los criterios de búsqueda. 
      
      Petición: "${prompt}"
      
      Instrucciones:
      - Si mencionan una ciudad específica (Madrid, Barcelona, Valencia, etc.), incluirla en "city"
      - Si mencionan servicios como "café", "wifi", "parking", "sala de reuniones", "24/7", "escritorio de pie", incluirlos en "amenities"
      - Los amenities válidos son: "wifi", "cafe", "sala-reuniones", "acceso-24-7", "parking", "escritorio-de-pie"
      - Si no encuentras criterios específicos, devuelve un objeto vacío {}
      
      Responde SOLO con un objeto JSON válido. Ejemplo:
      {"city": "Madrid", "amenities": ["wifi", "cafe"]}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: searchSchema,
      }
    });
    
    const result = await Promise.race([apiCall, timeoutPromise]);
    
    const responseText = result.text?.trim() || '';
    console.log("Gemini API response:", responseText);
    
    if (!responseText) {
        console.error("Gemini API returned an empty response.");
        return {};
    }

    const parsedResponse = JSON.parse(responseText);
    console.log("Parsed response:", parsedResponse);
    return parsedResponse as ParsedSearchQuery;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    // Simple fallback parsing
    const result: ParsedSearchQuery = {};
    const lowerPrompt = prompt.toLowerCase();
    
    // Basic city detection
    if (lowerPrompt.includes('madrid')) result.city = 'Madrid';
    else if (lowerPrompt.includes('barcelona')) result.city = 'Barcelona';
    else if (lowerPrompt.includes('valencia')) result.city = 'Valencia';
    
    // Basic amenity detection
    const amenities: string[] = [];
    if (lowerPrompt.includes('café') || lowerPrompt.includes('cafe')) amenities.push('cafe');
    if (lowerPrompt.includes('wifi')) amenities.push('wifi');
    if (lowerPrompt.includes('parking')) amenities.push('parking');
    if (lowerPrompt.includes('sala') || lowerPrompt.includes('reunión')) amenities.push('sala-reuniones');
    if (lowerPrompt.includes('24') || lowerPrompt.includes('24/7')) amenities.push('acceso-24-7');
    if (lowerPrompt.includes('pie') || lowerPrompt.includes('standing')) amenities.push('escritorio-de-pie');
    
    if (amenities.length > 0) result.amenities = amenities;
    
    console.log("Fallback parsing result:", result);
    return result;
  }
};

export const getAssistantResponse = async (prompt: string): Promise<AssistantResponse> => {
  try {
    console.log("Calling Gemini Assistant with prompt:", prompt);
    console.log("API Key available:", !!process.env.API_KEY);
    
    // Timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API timeout')), 10000);
    });
    
    const apiCall = ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Eres un asistente de coworking. Analiza lo que el usuario quiere hacer y responde con una acción específica.

Petición del usuario: "${prompt}"

Acciones posibles:
- "search": El usuario quiere buscar espacios (ej: "busca coworking en Madrid")
- "book": El usuario quiere hacer una reserva (ej: "reserva para el 26/07/2025 en BCN Hub Creativo")
- "help": El usuario pide ayuda o no está claro
- "unknown": No entiendes la petición

Si es una reserva (action: "book"):
- Extrae el nombre del espacio mencionado
- Extrae la fecha en formato YYYY-MM-DD
- Genera un mensaje confirmando los detalles

Si es una búsqueda (action: "search"):
- Extrae ciudad y servicios mencionados
- Genera un mensaje explicando qué buscas

Responde SOLO con JSON válido. Ejemplo:
{"action": "book", "spaceName": "BCN Hub Creativo", "date": "2025-07-26", "message": "Entendido, quieres reservar en BCN Hub Creativo para el 26 de julio de 2025. ¿Confirmas la reserva?"}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: assistantSchema,
      }
    });
    
    const result = await Promise.race([apiCall, timeoutPromise]);
    const responseText = result.text?.trim() || '';
    console.log("Gemini Assistant response:", responseText);
    
    if (!responseText) {
      return {
        action: 'unknown',
        message: 'Lo siento, no pude entender tu petición. ¿Puedes ser más específico?'
      };
    }

    const parsedResponse = JSON.parse(responseText);
    console.log("Parsed assistant response:", parsedResponse);
    return parsedResponse as AssistantResponse;

  } catch (error) {
    console.error("Error calling Gemini Assistant:", error);
    
    // Fallback parsing for common patterns
    const lowerPrompt = prompt.toLowerCase();
    
    // Check for booking intent
    if (lowerPrompt.includes('reserva') || lowerPrompt.includes('reservar') || lowerPrompt.includes('book')) {
      // Extract date pattern (DD/MM/YYYY or similar)
      const dateMatch = prompt.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      let date = '';
      if (dateMatch) {
        const [, day, month, year] = dateMatch;
        date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      // Extract space name (improved heuristics)
      let spaceName = '';
      
      // Try multiple patterns to extract space name
      const spacePatterns = [
        /en\s+([^,]+?)(?:\s+para|\s+el|\s*$)/i,  // "en Valencia Tech Place para"
        /en\s+(.+?)(?:\s+para|\s+el|\s*$)/i,     // More greedy match
        /"([^"]+)"/i,                            // Quoted names
        /reserva.*?(?:en\s+)?([A-Z][^,\n]+)/i   // Capitalized names
      ];
      
      for (const pattern of spacePatterns) {
        const match = prompt.match(pattern);
        if (match && match[1].trim()) {
          spaceName = match[1].trim();
          break;
        }
      }
      
      console.log("Fallback extracted space name:", spaceName, "from prompt:", prompt);
      
      return {
        action: 'book',
        spaceName,
        date,
        message: date && spaceName 
          ? `Entendido, quieres reservar en ${spaceName} para el ${date}. ¿Confirmas la reserva?`
          : 'Quieres hacer una reserva. ¿Puedes especificar el espacio y la fecha?'
      };
    }
    
    // Check for search intent
    if (lowerPrompt.includes('busca') || lowerPrompt.includes('buscar') || lowerPrompt.includes('encuentra')) {
      return {
        action: 'search',
        message: 'Voy a buscar espacios de coworking para ti.'
      };
    }
    
    // Default help response
    return {
      action: 'help',
      message: 'Puedo ayudarte a buscar espacios de coworking o hacer reservas. Prueba con: "busca coworking en Madrid" o "reserva para el 26/07/2025 en BCN Hub Creativo"'
    };
  }
};
