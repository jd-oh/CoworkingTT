// Test script para verificar la API de Gemini
// Ejecuta este script en la consola del navegador

async function testGeminiAPI() {
  console.log("Testing Gemini API...");
  console.log("API Key available:", !!process.env.API_KEY);
  console.log("API Key value:", process.env.API_KEY?.substring(0, 10) + "...");
  
  try {
    const { getStructuredSearchQuery } = await import('/src/services/geminiService.ts');
    
    console.log("Testing with query: 'coworking en Madrid con café'");
    const result = await getStructuredSearchQuery('coworking en Madrid con café');
    console.log("Result:", result);
    
    return result;
  } catch (error) {
    console.error("Error testing Gemini API:", error);
    return error;
  }
}

// Ejecutar el test
testGeminiAPI();
