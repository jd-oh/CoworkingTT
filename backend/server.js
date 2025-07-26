// Simple Express backend for coworking app
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock data (replace with database integration in production)
const spaces = [
  {
    id: '1',
    name: 'Innova Coworking Center',
    city: 'Madrid',
    address: 'Calle Gran Vía, 123',
    pricePerDay: 25,
    rating: 4.8,
    imageUrl: 'https://picsum.photos/seed/madrid1/600/400',
    amenities: ['wifi', 'cafe', 'sala-reuniones'],
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
    amenities: ['wifi', 'cafe', 'acceso-24-7'],
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
    amenities: ['wifi', 'cafe', 'parking'],
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
    amenities: ['wifi', 'cafe', 'escritorio-de-pie'],
    description: 'Espacio de trabajo ergonómico y bien conectado en una de las zonas más emblemáticas de Madrid.'
  }
];

const bookings = [];

// Helper to filter spaces
function filterSpaces(city, amenities) {
  let result = spaces;
  if (city) {
    result = result.filter(s => s.city.toLowerCase() === city.toLowerCase());
  }
  if (amenities && amenities.length > 0) {
    result = result.filter(s => amenities.every(a => s.amenities.includes(a)));
  }
  return result;
}

// Public endpoints
app.get('/api/spaces', (req, res) => {
  const { city, amenities } = req.query;
  const amenityList = typeof amenities === 'string' ? amenities.split(',') : undefined;
  res.json(filterSpaces(city, amenityList));
});

app.post('/api/bookings', (req, res) => {
  const { spaceId, userId, date } = req.body;
  if (!spaceId || !userId || !date) {
    return res.status(400).json({ message: 'spaceId, userId and date are required' });
  }
  const booking = { id: String(bookings.length + 1), spaceId, userId, date, status: 'pending' };
  bookings.push(booking);
  res.status(201).json(booking);
});

// Admin endpoints
app.get('/api/admin/stats', (req, res) => {
  res.json([
    { label: 'Ingresos Totales (Mes)', value: '€12,450', change: '+15.2%', changeType: 'increase' },
    { label: 'Reservas Activas', value: String(bookings.length), change: '+5', changeType: 'increase' },
    { label: 'Nuevos Usuarios', value: '45', change: '-3.1%', changeType: 'decrease' },
    { label: 'Ocupación Media', value: '78%', change: '+2.5%', changeType: 'increase' }
  ]);
});

app.get('/api/admin/bookings/recent', (req, res) => {
  const recent = bookings.slice(-5).map(b => {
    const space = spaces.find(s => s.id === b.spaceId);
    return { ...b, spaceName: space ? space.name : '', userName: `User ${b.userId}` };
  });
  res.json(recent);
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
