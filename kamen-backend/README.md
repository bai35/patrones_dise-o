# 🐉 Kam Men — Backend (Express + MongoDB Atlas)

Web completa de Chifa Kam Men: frontend servido por Express, base de datos en MongoDB Atlas, autenticación con JWT, gestión de platos/ofertas y reservas.

---

## Estructura del proyecto

```
kam-men-backend/
├── models/
│   ├── User.js           ← esquema de usuarios (rol: admin | cliente)
│   ├── Dish.js           ← esquema de platos (precio, oferta, precio oferta)
│   └── Reservation.js    ← esquema de reservas (estado: pendiente | confirmada | cancelada)
├── routes/
│   ├── auth.js           ← POST /api/auth/login, /register  GET /api/auth/me
│   ├── dishes.js         ← GET (público)  POST/PUT/DELETE (solo admin)
│   └── reservations.js   ← POST (público)  GET/PATCH/DELETE (admin)  GET /mine (cliente)
├── scripts/
│   └── seed.js           ← Crea los 3 usuarios y 6 platos por defecto en MongoDB
├── public/
│   └── index.html        ← Frontend completo (HTML + CSS + JS con fetch() a la API)
├── auth.js               ← Generación y verificación de tokens JWT
├── db.js                 ← Conexión a MongoDB Atlas
├── server.js             ← Punto de entrada: Express, rutas, archivos estáticos
├── .env.example          ← Variables de entorno necesarias (copia como .env)
└── package.json
```

---

## Puesta en marcha local

### 1. Clonar / descomprimir el proyecto
```bash
cd kam-men-backend
npm install
```

### 2. Crear tu cluster en MongoDB Atlas (gratis)
1. Ve a [mongodb.com/atlas](https://www.mongodb.com/atlas) y crea una cuenta gratuita.
2. Crea un **cluster** (el plan M0 gratuito es suficiente).
3. En **Database Access** → Add New Database User → crea un usuario con contraseña.
4. En **Network Access** → Add IP Address → agrega `0.0.0.0/0` (permite cualquier IP, conveniente para empezar; restringe en producción).
5. En el cluster → **Connect** → **Drivers** → copia la URI. Luce así:
   ```
   mongodb+srv://miusuario:micontraseña@cluster0.abc12.mongodb.net/?retryWrites=true&w=majority
   ```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```
Edita `.env`:
```env
MONGODB_URI=mongodb+srv://miusuario:micontraseña@cluster0.abc12.mongodb.net/kammen?retryWrites=true&w=majority
JWT_SECRET=escribe_aqui_cualquier_texto_largo_y_aleatorio_min_32_chars
PORT=4000
```
> ⚠️ **Nunca subas el `.env` real a GitHub.** El `.gitignore` ya lo excluye.

### 4. Ejecutar el seed (crea usuarios y platos por defecto)
```bash
npm run seed
```
Salida esperada:
```
✅ Conectado a MongoDB Atlas
Limpiando usuarios y platos existentes...
Creando usuarios de prueba...
  • admin    admin@kammen.pe        (contraseña: admin123)
  • cliente  maria@cliente.pe       (contraseña: cliente123)
  • cliente  jorge@cliente.pe       (contraseña: cliente123)
Creando platos iniciales...
  • 6 platos creados.
✅ Seed completado.
```

### 5. Arrancar el servidor
```bash
npm run dev      # desarrollo (se reinicia automáticamente al guardar)
# o
npm start        # producción
```
Abre el navegador en: **http://localhost:4000**

---

## Cuentas de prueba

| Rol | Correo | Contraseña | Acceso |
|---|---|---|---|
| **Admin** | admin@kammen.pe | admin123 | Panel completo (reservas + platos/ofertas) |
| Cliente | maria@cliente.pe | cliente123 | Ver sus propias reservas |
| Cliente | jorge@cliente.pe | cliente123 | Ver sus propias reservas |

---

## API — Resumen de endpoints

### Auth
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | — | Login, devuelve token JWT |
| POST | `/api/auth/register` | — | Registro de cliente nuevo |
| GET | `/api/auth/me` | ✅ Token | Usuario actual |

### Platos
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/dishes` | — | Lista todos los platos (pública) |
| POST | `/api/dishes` | 🔒 Admin | Crea un plato |
| PUT | `/api/dishes/:id` | 🔒 Admin | Edita nombre, precio, oferta |
| DELETE | `/api/dishes/:id` | 🔒 Admin | Elimina un plato |

### Reservas
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/reservations` | — | Crea una reserva (pública) |
| GET | `/api/reservations` | 🔒 Admin | Lista todas las reservas |
| GET | `/api/reservations/mine` | ✅ Token | Reservas del cliente autenticado |
| PATCH | `/api/reservations/:id/status` | 🔒 Admin | Confirmar / cancelar |
| DELETE | `/api/reservations/:id` | 🔒 Admin | Eliminar reserva |

---

## Despliegue en Render (recomendado, gratis)

1. Sube la carpeta `kam-men-backend` a un repositorio en **GitHub**.
2. Ve a [render.com](https://render.com) → New → **Web Service** → conecta tu repo.
3. Configura:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. En **Environment Variables** agrega:
   - `MONGODB_URI` → tu URI de Atlas
   - `JWT_SECRET` → tu texto secreto
5. Render asigna el PORT automáticamente.
6. Después del primer deploy: abre la URL de Render + `/api/health` para confirmar que funciona, luego corre el seed una sola vez localmente apuntando al mismo Atlas.

---

## Migración futura (si cambias a MySQL u otro backend)

Cada función en la capa `DB` del frontend (`/public/index.html`) llama a un endpoint concreto. Para migrar:
1. Mantén las mismas rutas de la API (`/api/auth/login`, `/api/dishes`, etc.)
2. Reemplaza los modelos de Mongoose por la librería de tu nuevo DB (ej. Sequelize para MySQL)
3. El frontend **no necesita ningún cambio**

---

## Seguridad — notas para producción

- Las contraseñas se guardan hasheadas con **bcrypt** (cost factor 10), nunca en texto plano.
- Los tokens JWT expiran en **7 días**; cambia `expiresIn` en `auth.js` si necesitas otro plazo.
- Cambia `JWT_SECRET` por un string aleatorio largo (mínimo 32 caracteres) antes de publicar.
- En **Network Access** de Atlas, restringe las IPs permitidas a las de tu servidor en producción.
- Considera agregar **rate limiting** (`express-rate-limit`) en las rutas de auth para producción.
