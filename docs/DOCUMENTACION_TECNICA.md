# 📘 Documentación Técnica - PokéStore Chile / Examen Fullstack

## 1. Visión General del Proyecto
**PokéStore Chile** es una aplicación web Full Stack de comercio electrónico diseñada para la venta de cartas Pokémon TCG. El sistema implementa una arquitectura moderna **Cliente-Servidor**, integración con pasarela de pagos real (**Webpay Plus**) y consumo de APIs externas.

### Tecnologías Utilizadas
*   **Backend**: Node.js + Express (API REST).
*   **Frontend**: React.js + Vite (Single Page Application).
*   **Base de Datos**: Arrays en memoria (Persistencia temporal durante el tiempo de ejecución).
*   **Seguridad**: JWT (JSON Web Tokens) para sesiones, `bcryptjs` para hashing de contraseñas.
*   **Integraciones**:
    *   **Transbank Webpay Plus**: Procesamiento de pagos (Ambiente Integración).
    *   **Pokémon TCG API**: Obtención de cartas aleatorias y datos reales.

---

## 2. Arquitectura & Seguridad
El sistema utiliza una arquitectura desacoplada:
1.  **API REST (Puerto 3000/Vercel)**: Gestiona la lógica de negocio, validaciones y acceso a datos.
2.  **Frontend (Puerto 5173/Vercel)**: Interfaz de usuario reactiva que consume la API mediante `fetch`.

**Mecanismos de Seguridad:**
*   **Autenticación**: Login mediante correo/contraseña encriptada. Se retorna un token **JWT** que debe enviarse en el header `Authorization: Bearer <token>`.
*   **Middlewares**: `authRequired` (protege rutas privadas) y `adminOnly` (protege rutas de gestión).
*   **Validaciones**: Verificación de RUT chileno (algoritmo módulo 11) y correos institucionales.

---

## 3. Listado de 15+ Endpoints (Rúbrica Nivel 5)
A continuación se detallan 16 endpoints clave implementados y probados, listos para corroboración.

### 🔐 A. Autenticación y Usuarios
| # | Método | Endpoint | Descripción | Requiere Auth |
|---|---|---|---|---|
| 1 | `POST` | `/api/auth/register` | Registra un nuevo cliente (Valida RUT/Correo). | No |
| 2 | `POST` | `/api/auth/login` | Inicia sesión y devuelve Token JWT + Datos. | No |
| 3 | `GET` | `/api/auth/profile` | Obtiene el perfil del usuario autenticado. | **Sí** |
| 4 | `PUT` | `/api/auth/profile` | Actualiza datos del perfil (teléfono, dirección). | **Sí** |
| 5 | `GET` | `/api/users` | Listado de todos los usuarios (Solo Admin). | **Sí (Admin)**|

### 📦 B. Productos (Catálogo)
| # | Método | Endpoint | Descripción | Requiere Auth |
|---|---|---|---|---|
| 6 | `GET` | `/api/productos` | Obtiene todos los productos. Soporta filtros (`?buscar=`, `?rareza=`). | No |
| 7 | `GET` | `/api/productos/:id` | Obtiene detalle de un producto específico. | No |
| 8 | `POST` | `/api/productos` | Crea un nuevo producto (Solo Admin). | **Sí (Admin)**|
| 9 | `PUT` | `/api/productos/:id` | Actualiza un producto existente (Solo Admin). | **Sí (Admin)**|
| 10| `DELETE`| `/api/productos/:id` | Elimina un producto (Solo Admin). | **Sí (Admin)**|

### 🛒 C. Carrito de Compras
| # | Método | Endpoint | Descripción | Requiere Auth |
|---|---|---|---|---|
| 11| `GET` | `/api/carrito` | Obtiene el carrito actual del usuario con sus totales. | **Sí** |
| 12| `POST` | `/api/carrito/items` | Agrega un producto al carrito o suma cantidad. | **Sí** |
| 13| `DELETE`| `/api/carrito` | Vacía el carrito de compras por completo. | **Sí** |

### 💳 D. Órdenes y Pagos (Webpay)
| # | Método | Endpoint | Descripción | Requiere Auth |
|---|---|---|---|---|
| 14| `GET` | `/api/ordenes` | Historial de órdenes del usuario logueado. | **Sí** |
| 15| `POST` | `/api/webpay/create` | Inicia transacción en Webpay (Retorna URL+Token). | **Sí** |
| 16| `POST` | `/api/webpay/commit` | Confirma pago con Transbank y valida estado. | No (Callback)|

---

## 4. Ejemplos de Pruebas (JSON)
Para probar en Postman, usar la colección adjunta `docs/Pokestore.postman_collection.json`.

**Ejemplo Body: Login**
```json
{
    "correo": "admin@pokestore.cl",
    "contrasena": "admin123"
}
```

**Ejemplo Body: Registrar Usuario**
```json
{
    "nombre": "Estudiante Duoc",
    "run": "20.123.456-7",
    "correo": "alumno@duocuc.cl",
    "contrasena": "pass123",
    "telefono": "+56911223344"
}
```

**Ejemplo Body: Crear Orden (Automático tras Webpay)**
El sistema de pago crea la orden automáticamente al confirmar el pago exitoso, gestionando:
1.  Validación de Stock.
2.  Descuento de Inventario.
3.  Cálculo de Totales (Envío gratis > $50.000).
4.  Generación de ID único (UUID).

---

## 5. Instrucciones de Ejecución
1.  **Instalar Dependencias**: `npm install`
2.  **Iniciar Servidor (Back + Front)**: `npm run dev` y `npm start` (en terminales separadas) o dejar que Vercel maneje el despliegue.
3.  **Probar Webpay**: Usar tarjetas de prueba de Transbank en ambiente Integración.
