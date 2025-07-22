# Database Schema

Sugerencia de tablas para implementar una base de datos relacional para la plataforma de coworking.

## Tabla `users`
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL -- 'user' o 'admin'
);
```

## Tabla `spaces`
```sql
CREATE TABLE spaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0,
    image_url TEXT,
    description TEXT
);
```

## Tabla `amenities`
```sql
CREATE TABLE amenities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);
```

## Tabla `space_amenities`
Relación muchos a muchos entre `spaces` y `amenities`.
```sql
CREATE TABLE space_amenities (
    space_id INTEGER REFERENCES spaces(id) ON DELETE CASCADE,
    amenity_id INTEGER REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (space_id, amenity_id)
);
```

## Tabla `bookings`
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    space_id INTEGER REFERENCES spaces(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
);
```

Estas tablas cubren usuarios, espacios de coworking, servicios disponibles y reservas.
