// Script para probar el formulario de agregar espacios
async function testAddSpaceForm() {
  console.log('🧪 Probando el formulario de agregar espacios...\n');
  
  const testSpace = {
    name: 'Test Coworking Space',
    city: 'Madrid',
    address: 'Calle Test, 123',
    pricePerDay: 35,
    rating: 4.8,
    imageUrl: 'https://picsum.photos/seed/test1/600/400',
    amenities: ['wifi', 'cafe', 'sala-reuniones'],
    description: 'Espacio de coworking de prueba para verificar el formulario.'
  };

  try {
    const response = await fetch('http://localhost:3002/api/admin/spaces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testSpace),
    });

    if (response.ok) {
      const newSpace = await response.json();
      console.log('✅ Espacio agregado exitosamente:');
      console.log(`   ID: ${newSpace.id}`);
      console.log(`   Nombre: ${newSpace.name}`);
      console.log(`   Ciudad: ${newSpace.city}`);
      console.log(`   Precio: €${newSpace.pricePerDay}/día`);
      console.log(`   Amenidades: ${newSpace.amenities.join(', ')}`);
      
      // Verificar que aparezca en la lista
      console.log('\n🔍 Verificando que aparezca en la lista de espacios...');
      const spacesResponse = await fetch('http://localhost:3002/api/spaces');
      const spaces = await spacesResponse.json();
      const foundSpace = spaces.find(s => s.id === newSpace.id);
      
      if (foundSpace) {
        console.log('✅ El espacio aparece correctamente en la lista');
        console.log(`📊 Total de espacios: ${spaces.length}`);
      } else {
        console.log('❌ Error: El espacio no aparece en la lista');
      }
      
    } else {
      console.log('❌ Error al agregar espacio:', response.status);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }
}

testAddSpaceForm();
