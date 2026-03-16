# User Explorer

Aplicación fullstack para explorar y gestionar usuarios: listar, buscar, filtrar, crear, editar y eliminar. Backend en Node.js/Express y frontend en React con Tailwind CSS.

---

## Requisitos

- **Node.js** 18 o superior
- **npm** (incluido con Node.js)

---

## Instrucciones para ejecutar el proyecto

### 1. Ejecutar el backend

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
cd backend
npm install
npm run dev
```

**Resultado esperado:** El servidor queda corriendo en `http://localhost:3000`.

Para comprobar que responde:
- `http://localhost:3000/api` → mensaje de bienvenida de la API
- `http://localhost:3000/api/users` → listado de usuarios (JSON)

**Importante:** Deja esta terminal abierta mientras usas la aplicación.

---

### 2. Ejecutar el frontend

Abre **otra terminal** (con el backend ya corriendo) en la raíz del proyecto y ejecuta:

```bash
cd frontend
npm install
npm run dev
```

**Resultado esperado:** La aplicación queda disponible en `http://localhost:5173`. En consola Vite indicará la URL local.

---

### 3. Usar la aplicación

1. Abre el navegador en **http://localhost:5173**
2. Verás el listado de usuarios, filtros (búsqueda, ciudad, empresa) y el botón **Nuevo usuario**
3. El frontend se comunica con el backend mediante el proxy configurado en Vite (`/api` → `http://localhost:3000`)

**Orden recomendado:** Primero arrancar el backend, luego el frontend. Si el backend no está corriendo, la app mostrará errores al cargar datos.

---

## Explicación de la solución

### Qué hace la aplicación

- **Listar usuarios** desde un JSON; la capa de modelo está aislada por si luego se cambia a base de datos.
- **Buscar en tiempo real** por nombre, email, teléfono, ciudad o empresa (debounce 300 ms).
- **Filtrar** por pais, ciudad y por empresa mediante desplegables que se actualizan al crear o eliminar usuarios.
- **Crear usuarios** con validación en frontend y backend (nombre, email obligatorios; teléfono opcional con formato por país).
- **Editar y eliminar usuarios** desde el modal de detalle.

### Tecnologías utilizadas

- **Backend:** Node.js, Express, express-validator, Morgan (logs), CORS
- **Frontend:** React, Vite, Tailwind CSS, Lucide React (iconos), Sonner (toasts)
- **Datos:** archivo JSON en `backend/src/data/users.json`

### Arquitectura del backend

- **Rutas:** definen las URLs y enlazan controladores y validación.
- **Controladores:** leen query/body, llaman al servicio y responden con JSON.
- **Servicio:** filtros, búsqueda y regla de email único.
- **Modelo:** lee y escribe el JSON; si mañana se usa BD, solo se toca aquí.

Flujo de una petición: **Ruta → Controlador → Servicio → Modelo**.

### Arquitectura del frontend

- **api.js:** todas las llamadas al backend pasan por aquí.
- **Hooks:** useUsers (listado y CRUD), useDebounce (búsqueda), useUserDetail (modal detalle).
- **UserExplorerPage:** une hooks y componentes.
- **Componentes:** reciben datos y callbacks por props.

### Validaciones

- **Backend:** express-validator (nombre, email, teléfono opcional 8–15 dígitos). En servicio se revisa email único (409 si existe).
- **Frontend:** validación en el form; errores del backend se muestran en el form y en toasts.

### Estructura de carpetas

```
/backend
  /src
    /controllers   → controladores HTTP
    /services      → lógica de negocio
    /models        → acceso a datos (JSON)
    /routes        → definición de rutas
    /middlewares   → validación y manejo de errores
    /data          → users.json
  app.js, server.js

/frontend
  /src
    /components   → UI reutilizable
    /pages        → UserExplorerPage
    /hooks        → useUsers, useDebounce, useUserDetail
    /services     → api.js
    /utils        → debounce, countryCodes
  App.jsx, main.jsx
```

---

## Scripts disponibles

**Backend** (`cd backend`):
- `npm run dev` — inicia el servidor en el puerto 3000

**Frontend** (`cd frontend`):
- `npm run dev` — inicia el servidor de desarrollo (puerto 5173)
- `npm run build` — genera la build de producción en `dist/`
