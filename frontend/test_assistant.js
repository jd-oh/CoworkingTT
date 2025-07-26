// Test del asistente - Copia y pega esto en la consola del navegador

async function testAssistant() {
  console.log("=== TEST ASISTENTE ===");
  
  // Test 1: Verificar espacios disponibles
  console.log("1. Verificando espacios disponibles...");
  try {
    const response = await fetch('/api/spaces');
    const spaces = await response.json();
    console.log("Espacios encontrados:", spaces.map(s => s.name));
    
    // Test 2: Verificar si Valencia Tech Place existe
    const valenciaSpace = spaces.find(s => s.name.includes("Valencia Tech"));
    console.log("Valencia Tech Place encontrado:", valenciaSpace ? valenciaSpace.name : "NO ENCONTRADO");
    
    // Test 3: Probar diferentes variaciones de búsqueda
    const testNames = ["Valencia Tech Place", "valencia tech place", "Valencia Tech", "Valencia"];
    testNames.forEach(name => {
      const found = spaces.find(s => 
        s.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(s.name.toLowerCase())
      );
      console.log(`Búsqueda "${name}":`, found ? found.name : "NO ENCONTRADO");
    });
    
  } catch (error) {
    console.error("Error en test:", error);
  }
}

// Ejecutar test
testAssistant();
