# Plataforma Inteligente de Coworking

Este proyecto ha sido reorganizado con una estructura separada para frontend y backend.

## Estructura del proyecto

```
CoworkingTT/
├── backend/           # Servidor Express (API)
│   ├── server.js
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
