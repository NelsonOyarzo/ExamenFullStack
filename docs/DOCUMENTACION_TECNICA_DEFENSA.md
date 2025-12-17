# 🛡️ Documentación Técnica y Defensa de Proyecto: PokéStore Chile

Este documento detalla la estructura técnica, endpoints y justificación del proyecto para su evaluación y defensa.

---

## 1. 🔌 Endpoints Creados

El backend expone una API RESTful organizada en los siguientes recursos:

| Método | Endpoint | Acción | Acceso |
| :--- | :--- | :--- | :--- |
| **Auth** | | | |
| `POST` | `/api/auth/register` | Registrar nuevo usuario | Público |
| `POST` | `/api/auth/login` | Iniciar sesión (Login) | Público |
| `GET` | `/api/auth/profile` | Obtener datos del usuario actual | Privado (Token) |
| `PUT` | `/api/auth/profile` | Actualizar datos del usuario | Privado (Token) |
| **Productos** | | | |
| `GET` | `/api/productos` | Listar catálogo (con filtros) | Público |
| `GET` | `/api/productos/:id` | Ver detalle de una carta | Público |
| `POST` | `/api/productos` | Crear nueva carta | Admin |
| `PUT` | `/api/productos/:id` | Editar carta | Admin |
| `PATCH` | `/api/productos/:id/stock`| Actualizar stock rápido | Admin |
| `DELETE` | `/api/productos/:id` | Eliminar carta | Admin |
| **Carrito** | | | |
| `GET` | `/api/carrito` | Ver contenido del carrito | Privado |
| `POST` | `/api/carrito/items` | Agregar producto | Privado |
| `PUT` | `/api/carrito/items/:id` | Modificar cantidad | Privado |
| `DELETE` | `/api/carrito/items/:id` | Eliminar item | Privado |
| **Órdenes** | | | |
| `POST` | `/api/ordenes` | Finalizar compra (Checkout) | Privado |
| `GET` | `/api/ordenes` | Historial de compras propias | Privado |
| `GET` | `/api/admin/ordenes` | Ver ventas globales | Admin |
| `PATCH` | `/api/admin/ordenes/:id` | Cambiar estado de envío | Admin |

---

## 2. 📖 Explicación de Endpoints

*   **Auth**: Maneja la identificación. No usa sesiones de servidor, sino **JWT (JSON Web Tokens)** para mantener al usuario conectado sin guardar estado en el servidor (Stateless).
*   **Productos**: Permite **CRUD** (Crear, Leer, Actualizar, Borrar). Incluye filtrado complejo por URL Query params (`?tipo=Fire&precioMax=5000`) para búsquedas avanzadas sin sobrecargar la red.
*   **Carrito**: Persiste la intención de compra. Valida el stock en tiempo real antes de agregar items para evitar sobreventas.
*   **Órdenes**: Es la transacción final. Congela el precio y los datos del momento de la compra para registro histórico.

---

## 3. 🚀 Documentación Postman

Para probar la API en Postman, configure una colección con las siguientes variables:
*   `base_url`: `http://localhost:3000/api`
*   `token`: (Se obtiene del login y se pega en el Auth de la colección como *Bearer Token*)

**Ejemplo de Request (Login):**
*   **URL**: `{{base_url}}/auth/login`
*   **Method**: `POST`
*   **Body (JSON)**:
    ```json
    {
      "correo": "admin@pokestore.cl",
      "contrasena": "admin123"
    }
    ```

**Ejemplo de Request (Crear Producto):**
*   **Headers**: `Authorization: Bearer {{token}}`
*   **Body (JSON)**:
    ```json
    {
      "nombre": "Mew V",
      "rareza": "Ultra Rare",
      "precio": 15000,
      "stock": 10,
      "tipo": "Psychic",
      "set": "Fusion Strike"
    }
    ```

---

## 4. 🔐 Autenticación y Seguridad

El sistema implementa seguridad en capas:

1.  **Encriptación (Bcrypt)**: Las contraseñas nunca se guardan en texto plano. Se usa `bcrypt.hashSync` con un "Salt" de 10 rondas.
2.  **Tokens (JWT)**: Al hacer login, el servidor firma un objeto JSON con una clave secreta (`process.env.JWT_SECRET`). Este token viaja en el header `Authorization` de cada petición.
3.  **Middleware `authRequired`**: Intercepta cada petición privada. Si el token no es válido o expiró, devuelve error `401 Unauthorized` inmediatamente.
4.  **Middleware `adminOnly`**: Verifica que, además de tener un token válido, el usuario tenga el rol `Administrador` antes de permitir acciones críticas (borrar productos).

---

## 5. 🧠 Explicación API REST Node.js

El Backend está construido sobre **Node.js** usando el framework **Express**.

*   **Arquitectura REST**: Utiliza verbos HTTP estándar (`GET`, `POST`, `PUT`, `DELETE`) para indicar la acción deseada.
*   **Formato de Intercambio**: Todo el intercambio de datos es estrictamente **JSON**, el estándar de la industria web moderna.
*   **CORS**: Configurado con el paquete `cors` para permitir que el Frontend (puerto 5173) se comunique con el Backend (puerto 3000) de forma segura.
*   **Router**: Las rutas están definidas secuencialmente. El servidor escucha peticiones y ejecuta la función correspondiente (Controlador) basándose en la URL.

---

## 6. 🌐 Páginas Conectadas

El Frontend (React) consume la API para dar vida a las vistas:

| Página Frontend | Archivo | Endpoints que consume |
| :--- | :--- | :--- |
| **Home** | `HomePage.tsx` | `GET /api/productos` (Para "Destacados") |
| **Catálogo** | `CatalogPage.tsx` | `GET /api/productos` (Con filtros) |
| **Detalle Producto** | `ProductDetailPage.tsx` | `GET /api/productos/:id` |
| **Carrito** | `CartPage.tsx` | `GET /api/carrito`, `PUT /items` |
| **Login/Registro** | `LoginPage.tsx` | `POST /api/auth/*` |
| **Dashboard Admin** | `AdminDashboardPage.tsx` | `GET /api/admin/stats`, `GET /users`, `POST /productos` |
| **Checkout** | `CheckoutPage.tsx` | `POST /api/ordenes` |

---

## 7. ☁️ Despliegue

El proyecto está preparado para desplegarse fácilmente:

**Backend (Servidor)**:
1.  Subir carpeta al servidor.
2.  Ejecutar `npm install`.
3.  Definir variables de entorno (`JWT_SECRET`, `PORT`).
4.  Ejecutar `npm start`.

**Frontend (Cliente)**:
1.  Ejecutar `npm run build`. Esto genera una carpeta `dist` con archivos estáticos (HTML, CSS, JS) optimizados y minificados.
2.  Estos archivos pueden alojarse en cualquier servidor web (Nginx, Netlify, Vercel) o ser servidos estáticamente por el mismo Backend.

---

## 8. 🛡️ Defensa de Proyecto (Requerimientos)

A continuación se justifica cómo el proyecto cumple con los requerimientos típicos de un examen de título Fullstack:

1.  **"Sistema Seguro con Login"**:
    *   *Cumplimiento*: Implementado con JWT, Encriptación de contraseñas y validación de Roles (Admin/Cliente).
    *   *Defensa*: Se eligió JWT por ser el estándar para SPAs, permitiendo escalabilidad.

2.  **"Validaciones de Negocio Chileno"**:
    *   *Cumplimiento*: Validación real de **RUT Chileno** (Módulo 11) tanto en Frontend (UX) como en Backend (Seguridad).
    *   *Defensa*: Garantiza la integridad de los datos de usuarios nacionales.

3.  **"CRUD Completo"**:
    *   *Cumplimiento*: Gestión total de Productos y Usuarios.
    *   *Defensa*: Se demuestra dominio de los 4 verbos HTTP y manejo de estado.

4.  **"Web Responsive"**:
    *   *Cumplimiento*: Diseño adaptativo usando **TailwindCSS**.
    *   *Defensa*: La tienda es accesible desde móviles y escritorios, requisito indispensable en 2024.

5.  **"Persistencia y Estado"**:
    *   *Cumplimiento*: Uso de API REST para persistencia y React Context para estado global.
    *   *Defensa*: Separación clara de responsabilidades (Frontend visual, Backend lógico).
