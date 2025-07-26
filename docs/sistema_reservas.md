# Sistema de Reservas Real - CoworkingTT

## Funcionalidades Principales

### 1. Sistema de Usuarios y Roles
El sistema maneja tres tipos de usuarios:
- **Admin**: Puede ver estadísticas y gestionar espacios
- **Empresa**: Cliente corporativo que puede hacer reservas
- **Freelancer**: Cliente independiente que puede hacer reservas

### 2. Usuarios de Demostración
Para probar el sistema, hay 3 usuarios preconfigurados:

#### Usuario Administrador:
- **Email**: admin@coworking.com
- **Contraseña**: admin123
- **Funcionalidades**: Ver dashboard, estadísticas, agregar nuevos espacios

#### Usuario Empresa:
- **Email**: empresa@company.com
- **Contraseña**: empresa123
- **Funcionalidades**: Hacer reservas, ver historial de reservas

#### Usuario Freelancer:
- **Email**: freelancer@work.com
- **Contraseña**: freelancer123
- **Funcionalidades**: Hacer reservas, ver historial de reservas

### 3. Sistema de Reservas Real

#### Características:
- **Persistencia en base de datos**: Las reservas se guardan en SQLite
- **Validación de usuario**: Solo usuarios logueados pueden reservar
- **Fecha mínima**: No se puede reservar en fechas pasadas
- **Estado de reservas**: Todas las reservas nuevas se crean con estado "confirmed"
- **Historial personal**: Cada usuario ve solo sus propias reservas

#### Proceso de Reserva:
1. Usuario debe estar logueado
2. Selecciona un espacio de la lista
3. Elige una fecha (no puede ser en el pasado)
4. Confirma la reserva
5. El sistema guarda la reserva en la base de datos
6. Se muestra mensaje de confirmación
7. La reserva aparece inmediatamente en "Mis Reservas"

### 4. Interfaz de Usuario

#### HomePage:
- **Búsqueda inteligente**: Usa IA para interpretar consultas naturales
- **Filtros por ciudad**: Filtra espacios por ubicación
- **Modal de reserva**: Interfaz clara para el proceso de reserva
- **Sección "Mis Reservas"**: Muestra las reservas del usuario logueado
- **Estados de carga**: Indicadores visuales durante operaciones

#### Validaciones de UI:
- Botón de reserva deshabilitado si no hay usuario logueado
- Mensaje claro pidiendo login si no está autenticado
- Estados de carga durante el proceso de reserva
- Mensajes de éxito/error claros
- Cierre automático del modal tras reserva exitosa

### 5. Base de Datos

#### Tabla de Reservas (bookings):
```sql
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  spaceId TEXT NOT NULL,
  userId INTEGER NOT NULL,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed',
  FOREIGN KEY (userId) REFERENCES users (id),
  FOREIGN KEY (spaceId) REFERENCES spaces (id)
)
```

#### Relaciones:
- Una reserva pertenece a un usuario (FK: userId)
- Una reserva pertenece a un espacio (FK: spaceId)
- Un usuario puede tener múltiples reservas
- Un espacio puede tener múltiples reservas

### 6. API Endpoints

#### Autenticación:
- `POST /api/auth/login`: Iniciar sesión
- `POST /api/auth/register`: Registrar nuevo usuario

#### Reservas:
- `POST /api/bookings`: Crear nueva reserva
- `GET /api/bookings/user/:userId`: Obtener reservas de un usuario

#### Espacios:
- `GET /api/spaces`: Obtener todos los espacios (con filtros opcionales)
- `POST /api/spaces`: Crear nuevo espacio (solo admin)

### 7. Cómo Probar el Sistema

1. **Iniciar servidores**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   node server.js
   
   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

2. **Acceder a la aplicación**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3002

3. **Flujo de prueba**:
   - Ir a http://localhost:5173
   - Hacer clic en "Iniciar Sesión"
   - Usar credenciales de empresa o freelancer
   - Navegar a "Inicio"
   - Seleccionar un espacio
   - Hacer una reserva
   - Verificar que aparece en "Mis Reservas"

### 8. Diferencias con el Sistema Anterior

#### Antes (Simulado):
- Reservas solo mostraban alert()
- No se guardaba información
- No había validación de usuarios
- No había persistencia

#### Ahora (Real):
- Reservas se guardan en base de datos SQLite
- Validación completa de usuarios y roles
- Historial personal de reservas
- Estados de carga y mensajes informativos
- Integración completa frontend-backend
- Relaciones de base de datos apropiadas

### 9. Estructura de Archivos Actualizada

```
CoworkingTT/
├── backend/
│   ├── database.js          # Operaciones de base de datos
│   ├── server.js           # Servidor Express con endpoints de reservas
│   └── coworking.db        # Base de datos SQLite
├── frontend/
│   ├── pages/
│   │   └── HomePage.tsx    # Página principal con reservas reales
│   ├── services/
│   │   └── coworkingService.ts # Servicios de API incluyendo reservas
│   └── types.ts           # Tipos TypeScript actualizados
└── docs/
    └── sistema_reservas.md # Este documento
```

## Conclusión

El sistema de reservas ahora es completamente funcional y real. Los usuarios pueden crear cuentas, iniciar sesión, hacer reservas que se persisten en la base de datos, y ver su historial personal. La interfaz proporciona feedback claro en cada paso del proceso y maneja apropiadamente los estados de carga y error.
