import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create database connection
const db = new sqlite3.Database(join(__dirname, 'coworking.db'));

// Initialize database tables
export function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,  -- In production, this should be hashed
          name TEXT NOT NULL,
          role TEXT CHECK(role IN ('admin', 'empresa', 'freelancer')) NOT NULL,
          company TEXT,  -- Only for empresa users
          phone TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create spaces table
      db.run(`
        CREATE TABLE IF NOT EXISTS spaces (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          city TEXT NOT NULL,
          address TEXT NOT NULL,
          pricePerDay REAL NOT NULL,
          rating REAL DEFAULT 0,
          imageUrl TEXT,
          amenities TEXT, -- JSON string
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create bookings table
      db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          spaceId INTEGER NOT NULL,
          userId INTEGER NOT NULL,
          date TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (spaceId) REFERENCES spaces (id),
          FOREIGN KEY (userId) REFERENCES users (id)
        )
      `);

      // Insert initial users if users table is empty
      db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (err) {
          console.error('Error checking users table:', err);
          return;
        }

        if (row.count === 0) {
          const users = [
            {
              email: 'admin@coworking.com',
              password: 'admin123', // In production, this should be hashed
              name: 'Administrador',
              role: 'admin',
              company: null,
              phone: '+34 600 123 456'
            },
            {
              email: 'empresa@techcorp.com',
              password: 'empresa123',
              name: 'Tech Corp Solutions',
              role: 'empresa',
              company: 'TechCorp Solutions',
              phone: '+34 600 234 567'
            },
            {
              email: 'freelancer@gmail.com',
              password: 'freelancer123',
              name: 'Carlos Rodríguez',
              role: 'freelancer',
              company: null,
              phone: '+34 600 345 678'
            }
          ];

          const insertUser = db.prepare(`
            INSERT INTO users (email, password, name, role, company, phone)
            VALUES (?, ?, ?, ?, ?, ?)
          `);

          users.forEach(user => {
            insertUser.run([
              user.email,
              user.password,
              user.name,
              user.role,
              user.company,
              user.phone
            ]);
          });

          insertUser.finalize();
          console.log('Initial users data inserted');
        }
      });

      // Insert initial data if spaces table is empty
      db.get("SELECT COUNT(*) as count FROM spaces", (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row.count === 0) {
          const spaces = [
            {
              name: 'Innova Coworking Center',
              city: 'Madrid',
              address: 'Calle Gran Vía, 123',
              pricePerDay: 25,
              rating: 4.8,
              imageUrl: 'https://picsum.photos/seed/madrid1/600/400',
              amenities: JSON.stringify(['wifi', 'cafe', 'sala-reuniones']),
              description: 'Un espacio moderno y vibrante en el corazón de Madrid, perfecto para startups y freelancers.'
            },
            {
              name: 'BCN Hub Creativo',
              city: 'Barcelona',
              address: 'Passeig de Gràcia, 45',
              pricePerDay: 30,
              rating: 4.9,
              imageUrl: 'https://picsum.photos/seed/bcn1/600/400',
              amenities: JSON.stringify(['wifi', 'cafe', 'acceso-24-7']),
              description: 'Fomenta tu creatividad en nuestro hub de Barcelona, con acceso ininterrumpido y una comunidad increíble.'
            },
            {
              name: 'Valencia Tech Place',
              city: 'Valencia',
              address: 'Avenida del Puerto, 78',
              pricePerDay: 22,
              rating: 4.7,
              imageUrl: 'https://picsum.photos/seed/valencia1/600/400',
              amenities: JSON.stringify(['wifi', 'cafe', 'parking']),
              description: 'El punto de encuentro para la tecnología en Valencia. Ofrecemos instalaciones de primera y parking gratuito.'
            },
            {
              name: 'Madrid Connect',
              city: 'Madrid',
              address: 'Calle de Alcalá, 200',
              pricePerDay: 28,
              rating: 4.6,
              imageUrl: 'https://picsum.photos/seed/madrid2/600/400',
              amenities: JSON.stringify(['wifi', 'cafe', 'escritorio-de-pie']),
              description: 'Espacio de trabajo ergonómico y bien conectado en una de las zonas más emblemáticas de Madrid.'
            }
          ];

          const insertSpace = db.prepare(`
            INSERT INTO spaces (name, city, address, pricePerDay, rating, imageUrl, amenities, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `);

          spaces.forEach(space => {
            insertSpace.run([
              space.name,
              space.city,
              space.address,
              space.pricePerDay,
              space.rating,
              space.imageUrl,
              space.amenities,
              space.description
            ]);
          });

          insertSpace.finalize();
          console.log('Initial spaces data inserted');
        }

        resolve();
      });
    });
  });
}

// Database operations
export const dbOperations = {
  // User operations
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  },

  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  },

  createUser: (userData) => {
    return new Promise((resolve, reject) => {
      const { email, password, name, role, company, phone } = userData;
      
      db.run(
        `INSERT INTO users (email, password, name, role, company, phone)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [email, password, name, role, company, phone],
        function(err) {
          if (err) {
            reject(err);
            return;
          }

          // Get the created user
          db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(row);
          });
        }
      );
    });
  },

  // Get all spaces with optional filters
  getSpaces: (city, amenities) => {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM spaces';
      const params = [];

      if (city || (amenities && amenities.length > 0)) {
        query += ' WHERE';
        const conditions = [];

        if (city) {
          conditions.push(' LOWER(city) = LOWER(?)');
          params.push(city);
        }

        if (amenities && amenities.length > 0) {
          amenities.forEach(amenity => {
            conditions.push(' amenities LIKE ?');
            params.push(`%"${amenity}"%`);
          });
        }

        query += conditions.join(' AND');
      }

      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        // Parse amenities JSON for each space
        const spaces = rows.map(space => ({
          ...space,
          amenities: JSON.parse(space.amenities || '[]')
        }));

        resolve(spaces);
      });
    });
  },

  // Get space by ID
  getSpaceById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM spaces WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row) {
          row.amenities = JSON.parse(row.amenities || '[]');
        }

        resolve(row);
      });
    });
  },

  // Create a new booking
  createBooking: (spaceId, userId, date) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO bookings (spaceId, userId, date) VALUES (?, ?, ?)',
        [spaceId, parseInt(userId), date],
        function(err) {
          if (err) {
            reject(err);
            return;
          }

          // Get the created booking with space and user details
          const query = `
            SELECT b.*, s.name as spaceName, u.name as userName 
            FROM bookings b 
            LEFT JOIN spaces s ON b.spaceId = s.id 
            LEFT JOIN users u ON b.userId = u.id
            WHERE b.id = ?
          `;
          
          db.get(query, [this.lastID], (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(row);
          });
        }
      );
    });
  },

  // Get all bookings
  getBookings: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT b.*, s.name as spaceName, u.name as userName 
        FROM bookings b 
        LEFT JOIN spaces s ON b.spaceId = s.id 
        LEFT JOIN users u ON b.userId = u.id
        ORDER BY b.created_at DESC
      `;
      
      db.all(query, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  },

  // Get recent bookings with space names
  getRecentBookings: (limit = 5) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT b.*, s.name as spaceName, u.name as userName 
        FROM bookings b 
        LEFT JOIN spaces s ON b.spaceId = s.id 
        LEFT JOIN users u ON b.userId = u.id
        ORDER BY b.created_at DESC 
        LIMIT ?
      `;

      db.all(query, [limit], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  },

  // Get bookings by user
  getBookingsByUser: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT b.*, s.name as spaceName, s.address, s.pricePerDay
        FROM bookings b 
        LEFT JOIN spaces s ON b.spaceId = s.id 
        WHERE b.userId = ?
        ORDER BY b.created_at DESC
      `;

      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  },

  // Add a new space
  addSpace: (spaceData) => {
    return new Promise((resolve, reject) => {
      const { name, city, address, pricePerDay, rating, imageUrl, amenities, description } = spaceData;
      
      db.run(
        `INSERT INTO spaces (name, city, address, pricePerDay, rating, imageUrl, amenities, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, city, address, pricePerDay, rating || 0, imageUrl, JSON.stringify(amenities || []), description],
        function(err) {
          if (err) {
            reject(err);
            return;
          }

          // Get the created space
          db.get('SELECT * FROM spaces WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            
            if (row) {
              row.amenities = JSON.parse(row.amenities || '[]');
            }
            
            resolve(row);
          });
        }
      );
    });
  }
};

export default db;
