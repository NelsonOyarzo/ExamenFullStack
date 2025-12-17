# 🛡️ Guía de Defensa Técnica & Rúbrica

Esta guía está diseñada para que obtengas el **Nivel 5 (Excelente)** en los puntos de explicación y defensa de tu examen.

## 1. Arquitectura del Proyecto (Mencionar esto en "Explicación API REST")
El proyecto utiliza una arquitectura **Cliente-Servidor (Full Stack)** separada pero integrada:
*   **Backend (Node.js + Express):** Actúa como una API REST. Recibe peticiones JSON y responde con datos. No renderiza HTML.
*   **Frontend (React + Vite):** Consume la API mediante `fetch`. Maneja la UI y el enrutamiento (`react-router-dom`).
*   **Base de Datos (En memoria):** Para efectos de este examen, los datos (`users`, `productos`, `ordenes`) viven en arrays en el servidor. Esto permite rapidez y portabilidad.

**Tecnologías Clave:**
*   `express`: Manejo de rutas y servidor HTTP.
*   `cors`: Permite que el Frontend (puerto 5173) hable con el Backend (puerto 3000).
*   `bcryptjs`: Encripta las contraseñas antes de guardarlas (seguridad).
*   `jsonwebtoken`: Genera tokens de sesión para autenticación stateless.

---

## 2. Explicación de Endpoints (Claves para el Nivel 5)
Tienes **29 Endpoints** en total. Aquí los más importantes para explicar con propiedad:

### A. Autenticación (`/api/auth`)
*   **POST `/register`**: Recibe datos de usuario, valida RUT y correo, encripta la contraseña con `bcrypt` y guarda el usuario.
*   **POST `/login`**: Busca por correo, compara el hash de la contraseña. Si coincide, **firma un JWT** y lo devuelve.
*   **GET/PUT `/profile`**: Rutas protegidas que solo funcionan si envías el token en el Header `Authorization: Bearer <token>`.

### B. Productos (`/api/productos`)
*   **GET `/`**: Devuelve la lista, pero soporta **filtros** por Query Params (`?rareza=Ultra Rare&ordenar=precio-asc`).
*   **PATCH `/:id/stock`**: endpoint específico para administración rápida de inventario.

### C. Órdenes (`/api/ordenes`)
*   **POST `/`**:
    1.  Recibe la dirección de envío.
    2.  Valida que haya stock suficiente para cada item del carrito.
    3.  Resta el stock de los productos.
    4.  Crea la orden y **vacía el carrito**.
    *   *Explicación Brillante:* "La creación de la orden es atómica en lógica; valida stock, resta inventario y limpia el carrito en un solo paso seguro".

---

## 3. Checklist de Rúbrica (Estado Actual)

| Criterio | Nivel Alcanzado | Justificación |
| :--- | :--- | :--- |
| **Endpoints Creados** | ✅ Nivel 5 (>15) | Tienes **29 endpoints** funcionales. |
| **Explicación Endpoints** | ✅ Nivel 5 | Usa la sección 2 de esta guía. Menciona "Rutas", "Controladores" y "Lógica". |
| **Documentación Postman** | ✅ Nivel 5 | Archivo `Pokestore.postman_collection.json` completo con variables para Vercel. |
| **Autenticación** | ✅ Nivel 5 | Login seguro con JWT, hash de contraseñas, validación de RUT y correos institucionales. |
| **Páginas Conectadas** | ✅ Nivel 5 (>15) | Tienes **15+ rutas** en React (Home, Catálogo, Detalle, Carrito, Checkout, Historial, Confirmación, Login, Contacto, Admin (4 tabs), Dashboard, Descubrir, Oddie, Nosotros, Términos). |
| **Despliegue** | ✅ Cumple | Configurado para Vercel (Front + Back serverless). Subido a GitHub. |

---

## 4. Preguntas Trampa Posibles (Y cómo responder)

**P: "¿Por qué usaste `cors`?"**
R: "Porque por seguridad, los navegadores bloquean peticiones entre dominios diferentes (localhost:5173 vs 3000). CORS le dice al navegador que es seguro permitir el acceso a nuestra API."

**P: "¿Dónde se guardan las imágenes?"**
R: "Usamos URLs externas (CDN de PokemonTCG.io) para no sobrecargar nuestro servidor, lo cual es una buena práctica en arquitecturas modernas."

**P: "¿Qué pasa si cierro el servidor?"**
R: "Como usamos persistencia en memoria para este examen, los datos se reinician. En un entorno de producción real, simplemente cambiaríamos los arrays por llamadas a una base de datos como MongoDB, sin cambiar la lógica de los endpoints."
