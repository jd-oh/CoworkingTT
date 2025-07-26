import { dbOperations } from './database.js';

// Nuevos espacios para agregar
const newSpaces = [
  {
    name: 'Bilbao Creative Space',
    city: 'Bilbao',
    address: 'Gran Vía, 25',
    pricePerDay: 26,
    rating: 4.4,
    imageUrl: 'https://picsum.photos/seed/bilbao1/600/400',
    amenities: ['wifi', 'cafe', 'acceso-24-7', 'parking'],
    description: 'Espacio creativo en el corazón de Bilbao, perfecto para profesionales del diseño y la tecnología.'
  },
  {
    name: 'Zaragoza Tech Hub',
    city: 'Zaragoza',
    address: 'Paseo de la Independencia, 180',
    pricePerDay: 20,
    rating: 4.3,
    imageUrl: 'https://picsum.photos/seed/zaragoza1/600/400',
    amenities: ['wifi', 'cafe', 'sala-reuniones'],
    description: 'Un hub tecnológico moderno en Zaragoza con excelente conectividad y ambiente colaborativo.'
  },
  {
    name: 'Granada Startup Center',
    city: 'Granada',
    address: 'Calle Reyes Católicos, 45',
    pricePerDay: 18,
    rating: 4.6,
    imageUrl: 'https://picsum.photos/seed/granada1/600/400',
    amenities: ['wifi', 'cafe', 'escritorio-de-pie', 'parking'],
    description: 'Centro de startups en Granada con vistas a la Alhambra y ambiente inspirador para emprendedores.'
  },
  {
    name: 'Málaga Beach Work',
    city: 'Málaga',
    address: 'Calle Larios, 8',
    pricePerDay: 27,
    rating: 4.9,
    imageUrl: 'https://picsum.photos/seed/malaga1/600/400',
    amenities: ['wifi', 'cafe', 'acceso-24-7', 'sala-reuniones'],
    description: 'Trabaja cerca del mar en este espacio único de Málaga, perfecto para nómadas digitales.'
  },
  {
    name: 'Vigo Innovation Lab',
    city: 'Vigo',
    address: 'Rúa do Príncipe, 30',
    pricePerDay: 21,
    rating: 4.2,
    imageUrl: 'https://picsum.photos/seed/vigo1/600/400',
    amenities: ['wifi', 'cafe', 'parking'],
    description: 'Laboratorio de innovación en Vigo con enfoque en tecnologías marinas y sostenibilidad.'
  }
];

async function addMultipleSpaces() {
  try {
    console.log('Agregando nuevos espacios de coworking...\n');
    
    for (const space of newSpaces) {
      console.log(`📍 Agregando: ${space.name} (${space.city})`);
      const newSpace = await dbOperations.addSpace(space);
      console.log(`✅ Espacio agregado con ID: ${newSpace.id}\n`);
    }
    
    console.log('🎉 Todos los espacios han sido agregados exitosamente!');
    
    // Mostrar resumen
    const allSpaces = await dbOperations.getSpaces();
    console.log(`\n📊 Total de espacios en la base de datos: ${allSpaces.length}`);
    
    // Mostrar por ciudades
    const cities = [...new Set(allSpaces.map(s => s.city))];
    console.log('\n🏙️ Espacios por ciudad:');
    cities.forEach(city => {
      const count = allSpaces.filter(s => s.city === city).length;
      console.log(`   ${city}: ${count} espacio${count > 1 ? 's' : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Error agregando espacios:', error);
  }
  
  process.exit(0);
}

addMultipleSpaces();
