import React from 'react';
import type { CoworkingSpace, AdminStat, Booking, Amenity } from '../types';
import { WifiIcon, UserGroupIcon } from '../components/Icon';

const commonAmenities: Amenity[] = [
    { id: 'wifi', name: 'WiFi de Alta Velocidad', icon: React.createElement(WifiIcon, {className: 'w-5 h-5'}) },
    { id: 'cafe', name: 'Café Incluido', icon: React.createElement(UserGroupIcon, {className: 'w-5 h-5'}) },
];

const mockSpaces: CoworkingSpace[] = [
  {
    id: '1',
    name: 'Innova Coworking Center',
    city: 'Madrid',
    address: 'Calle Gran Vía, 123',
    pricePerDay: 25,
    rating: 4.8,
    imageUrl: 'https://picsum.photos/seed/madrid1/600/400',
    amenities: [...commonAmenities, { id: 'sala-reuniones', name: 'Salas de Reuniones', icon: React.createElement(UserGroupIcon, {className: 'w-5 h-5'}) }],
    description: 'Un espacio moderno y vibrante en el corazón de Madrid, perfecto para startups y freelancers.'
  },
  {
    id: '2',
    name: 'BCN Hub Creativo',
    city: 'Barcelona',
    address: 'Passeig de Gràcia, 45',
    pricePerDay: 30,
    rating: 4.9,
    imageUrl: 'https://picsum.photos/seed/bcn1/600/400',
    amenities: [...commonAmenities, { id: 'acceso-24-7', name: 'Acceso 24/7', icon: React.createElement(UserGroupIcon, {className: 'w-5 h-5'}) }],
    description: 'Fomenta tu creatividad en nuestro hub de Barcelona, con acceso ininterrumpido y una comunidad increíble.'
  },
  {
    id: '3',
    name: 'Valencia Tech Place',
    city: 'Valencia',
    address: 'Avenida del Puerto, 78',
    pricePerDay: 22,
    rating: 4.7,
    imageUrl: 'https://picsum.photos/seed/valencia1/600/400',
    amenities: [...commonAmenities, { id: 'parking', name: 'Parking Gratuito', icon: React.createElement(UserGroupIcon, {className: 'w-5 h-5'}) }],
    description: 'El punto de encuentro para la tecnología en Valencia. Ofrecemos instalaciones de primera y parking gratuito.'
  },
  {
    id: '4',
    name: 'Madrid Connect',
    city: 'Madrid',
    address: 'Calle de Alcalá, 200',
    pricePerDay: 28,
    rating: 4.6,
    imageUrl: 'https://picsum.photos/seed/madrid2/600/400',
    amenities: [...commonAmenities, { id: 'escritorio-de-pie', name: 'Escritorios de Pie', icon: React.createElement(UserGroupIcon, {className: 'w-5 h-5'}) }],
    description: 'Espacio de trabajo ergonómico y bien conectado en una de las zonas más emblemáticas de Madrid.'
  },
];


export const searchSpaces = async (city?: string, amenities?: string[]): Promise<CoworkingSpace[]> => {
    console.log(`Searching for spaces in ${city} with amenities: ${amenities?.join(', ')}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    let results = mockSpaces;

    if (city) {
        results = results.filter(space => space.city.toLowerCase() === city.toLowerCase());
    }

    if (amenities && amenities.length > 0) {
        results = results.filter(space => 
            amenities.every(reqAmenity => 
                space.amenities.some(spaceAmenity => spaceAmenity.id.includes(reqAmenity.toLowerCase()))
            )
        );
    }
    
    return results;
};

export const getAdminStats = async (): Promise<AdminStat[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { label: 'Ingresos Totales (Mes)', value: '€12,450', change: '+15.2%', changeType: 'increase' },
        { label: 'Reservas Activas', value: '132', change: '+5', changeType: 'increase' },
        { label: 'Nuevos Usuarios', value: '45', change: '-3.1%', changeType: 'decrease' },
        { label: 'Ocupación Media', value: '78%', change: '+2.5%', changeType: 'increase' }
    ];
};

export const getRecentBookings = async (): Promise<(Booking & { spaceName: string; userName: string })[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { id: 'b1', spaceId: '1', userId: 'u1', date: '2024-08-15', status: 'confirmed', spaceName: 'Innova Coworking Center', userName: 'Ana García' },
        { id: 'b2', spaceId: '2', userId: 'u2', date: '2024-08-16', status: 'confirmed', spaceName: 'BCN Hub Creativo', userName: 'Carlos Pérez' },
        { id: 'b3', spaceId: '3', userId: 'u3', date: '2024-08-17', status: 'pending', spaceName: 'Valencia Tech Place', userName: 'Laura Martínez' },
    ];
};
