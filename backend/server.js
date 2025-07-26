// Express backend for coworking app with SQLite database
import express from 'express';
import cors from 'cors';
import { initDatabase, dbOperations } from './database.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Initialize database on startup
await initDatabase();
console.log('Database initialized successfully');

// Public endpoints - Get spaces with optional filters
app.get('/api/spaces', async (req, res) => {
  try {
    const { city, amenities } = req.query;
    const amenityList = typeof amenities === 'string' ? amenities.split(',') : undefined;
    const spaces = await dbOperations.getSpaces(city, amenityList);
    res.json(spaces);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    res.status(500).json({ message: 'Error fetching spaces' });
  }
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await dbOperations.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const userData = req.body;
    const existingUser = await dbOperations.getUserByEmail(userData.email);
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await dbOperations.createUser(userData);
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error during registration' });
  }
});

// Create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { spaceId, userId, date } = req.body;
    if (!spaceId || !userId || !date) {
      return res.status(400).json({ message: 'spaceId, userId and date are required' });
    }
    
    const booking = await dbOperations.createBooking(spaceId, userId, date);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Get user's bookings
app.get('/api/bookings/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await dbOperations.getBookingsByUser(userId);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Add a new space (admin endpoint)
app.post('/api/admin/spaces', async (req, res) => {
  try {
    const spaceData = req.body;
    const newSpace = await dbOperations.addSpace(spaceData);
    res.status(201).json(newSpace);
  } catch (error) {
    console.error('Error adding space:', error);
    res.status(500).json({ message: 'Error adding space' });
  }
});

// Admin endpoints - Get statistics
app.get('/api/admin/stats', async (req, res) => {
  try {
    const bookings = await dbOperations.getBookings();
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
    
    res.json([
      { label: 'Ingresos Totales (Mes)', value: '€12,450', change: '+15.2%', changeType: 'increase' },
      { label: 'Reservas Activas', value: String(activeBookings), change: '+5', changeType: 'increase' },
      { label: 'Nuevos Usuarios', value: '45', change: '-3.1%', changeType: 'decrease' },
      { label: 'Ocupación Media', value: '78%', change: '+2.5%', changeType: 'increase' }
    ]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Get recent bookings
app.get('/api/admin/bookings/recent', async (req, res) => {
  try {
    const recentBookings = await dbOperations.getRecentBookings(5);
    res.json(recentBookings);
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({ message: 'Error fetching recent bookings' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
