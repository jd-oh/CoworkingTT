# CoworkingTT - Plataforma de Coworking

Una aplicación web completa para la reserva de espacios de coworking, desarrollada con React (frontend) y Express + SQLite (backend).

## 🏗️ Estructura del Proyecto

```
CoworkingTT/
├── backend/                 # Servidor Express con base de datos SQLite
│   ├── coworking.db        # Base de datos SQLite (se genera automáticamente)
│   ├── database.js         # Configuración y operaciones de base de datos
│   ├── server.js           # Servidor Express principal
│   ├── test-db.js          # Script de pruebas de base de datos
│   └── package.json        # Dependencias del backend
├── frontend/               # Aplicación React con TypeScript
│   ├── components/         # Componentes React reutilizables
│   ├── pages/             # Páginas principales de la aplicación
│   ├── services/          # Servicios para comunicación con API
│   ├── index.html         # Punto de entrada HTML
│   ├── index.tsx          # Punto de entrada React
│   ├── vite.config.ts     # Configuración de Vite
│   └── package.json       # Dependencias del frontend
└── docs/                  # Documentación del proyecto
```

## 🚀 Características

### Backend (Express + SQLite)
- **Base de datos SQLite** para persistencia de datos
- **API RESTful** para espacios de coworking y reservas
- **Endpoints de administración** para estadísticas y gestión
- **Inicialización automática** de la base de datos con datos de ejemplo

### Frontend (React + TypeScript)
- **Interfaz moderna** desarrollada con React y TypeScript
- **Proxy configurado** para comunicación con el backend
- **Componentes reutilizables** para una mejor organización del código
- **Servicios centralizados** para las llamadas a la API

## 📊 Base de Datos

### Tablas Principales

#### `spaces` - Espacios de Coworking
- `id`: ID único (autoincremental)
- `name`: Nombre del espacio
- `city`: Ciudad donde se ubica
- `address`: Dirección completa
- `pricePerDay`: Precio por día en euros
- `rating`: Calificación (0-5)
- `imageUrl`: URL de la imagen del espacio
- `amenities`: Comodidades en formato JSON
- `description`: Descripción del espacio
- `created_at`: Fecha de creación

#### `bookings` - Reservas
- `id`: ID único (autoincremental)
- `spaceId`: ID del espacio reservado (FK)
- `userId`: ID del usuario que reserva
- `date`: Fecha de la reserva
- `status`: Estado de la reserva (pending, confirmed, cancelled)
- `created_at`: Fecha de creación
│   └── package.json
├── frontend/          # Aplicación React con Vite
│   ├── index.html
│   ├── index.tsx
│   ├── types.ts
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env.local
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── package.json
├── docs/              # Documentación
├── package.json       # Scripts principales
└── README.md
```

## Instalación

### Opción 1: Instalar todo de una vez
```bash
npm run install:all
```

### Opción 2: Instalar por separado
```bash
# Frontend
npm run install:frontend

# Backend
npm run install:backend
```

## Desarrollo

### Ejecutar ambos servicios simultáneamente
```bash
npm run dev
```

### Ejecutar por separado

#### Frontend (http://localhost:5173)
```bash
npm run dev:frontend
```

#### Backend (http://localhost:3001)
```bash
npm run dev:backend
```

## Scripts disponibles

- `npm run dev` - Ejecuta frontend y backend simultáneamente
- `npm run dev:frontend` - Solo frontend
- `npm run dev:backend` - Solo backend
- `npm run build:frontend` - Construye el frontend para producción
- `npm run install:all` - Instala dependencias en ambos proyectos
- `npm run install:frontend` - Instala dependencias del frontend
- `npm run install:backend` - Instala dependencias del backend

## Configuración

### Frontend
- Puerto: 5173 (desarrollo)
- Variables de entorno: `frontend/.env.local`
- Proxy API: `/api` → `http://localhost:3001`

### Backend
- Puerto: 3001
- API endpoints: `/api/*`
