# 📘 Documentación General Detallada: PokéStore Chile

## 🌟 Resumen Ejecutivo

**PokéStore Chile** es una plataforma de comercio electrónico moderna y segura dedicada a la venta de cartas Pokémon (TCG). No es solo una página web estática, sino una **Aplicación Web Progresiva (SPA)**. Esto significa que funciona de manera fluida, similar a una aplicación instalada en tu teléfono o computadora, sin necesidad de recargar la página completa cada vez que haces clic en algo.

---

## 🧭 Flujos de Usuario (Experiencia Paso a Paso)

Para entender mejor cómo funciona, desglosemos las acciones principales que ocurren en el sistema:

### 1. El Viaje del Cliente (The Shopper's Journey)
1.  **Aterrizaje**: El usuario llega a la página de inicio (`Home`), donde es recibido por una portada visualmente impactante y una selección de las cartas más destacadas ("Top Ventas").
2.  **Exploración**: Al ir al `Catálogo`, el usuario no ve una lista plana. Ve un sistema interactivo. Si selecciona "Tipo Fuego", el sistema filtra *instantáneamente* las cartas sin parpadear.
3.  **Decisión**: Al hacer clic en una carta (ej: "Charizard V"), entra a la `Ficha de Producto`. Aquí ve el precio, el stock real disponible y una descripción detallada.
4.  **Acumulación**: Al pulsar "Agregar al Carrito", la carta viaja a una memoria temporal. El icono del carrito en la esquina superior se actualiza con un número (ej: `1`).
5.  **Checkout (Caja)**: El usuario revisa su pedido. El sistema calcula el subtotal, el costo de envío (que puede ser gratuito si compra mucho) y el total final. Al confirmar, el stock se descuenta para todos los usuarios (evitando que dos personas compren la misma última carta).

### 2. El Flujo de Seguridad (Registro e Ingreso)
1.  **Validación Inteligente**: Cuando alguien se registra, el sistema actúa como un guardia de seguridad.
    *   **RUT**: Revisa matemáticamente si el número ingresado es un RUT chileno válido.
    *   **Correo**: Verifica que pertenezca a los dominios autorizados de la comunidad.
2.  **Encriptación**: Cuando el usuario crea su contraseña, el sistema la transforma en un código secreto (Hash) antes de guardarla. Ni siquiera los administradores pueden leer la contraseña original.

### 3. El Rol del Administrador (Back Office)
El administrador tiene una llave maestra que le permite ver el "detrás de escena":
*   **Visión Global**: Un tablero que muestra órdenes recientes y estado del negocio.
*   **Poder de Edición**: Si una carta sube de precio en el mercado real, el admin la actualiza en segundos. Si llega nueva mercadería, la crea subiendo una foto y llenando los datos.

---

## 🏗️ Arquitectura del Sistema (Una Mirada Profunda)

El proyecto utiliza una arquitectura de **Cliente-Servidor Separado**, el estándar moderno de la industria.

### A. El Frontend (La Cara Visible)
*   **Tecnología**: React + Vite + TailwindCSS.
*   **Filosofía**: Componentización.
    *   En lugar de escribir una página gigante de código, creamos "piezas de LEGO": un botón, una tarjeta, una barra de navegación.
    *   **Beneficio**: Si queremos cambiar todos los botones de azul a rojo, solo cambiamos la pieza "Botón" y se actualiza automáticamente en toda la tienda.
*   **Estado Global**: Usamos algo llamado `Context API`. Imagina que es una nube invisible que flota sobre la aplicación y recuerda cosas importantes (como qué usuario está conectado o qué hay en el carrito) para que esa información esté disponible en cualquier página sin tener que pedirla de nuevo.

### B. El Backend (El Cerebro Lógico)
*   **Tecnología**: Node.js + Express.
*   **Función API REST**: El Backend funciona como una ventanilla de atención. El Frontend le hace pedidos específicos (Requests) y el Backend responde (Responses).
    *   *Frontend*: "¿Tienes la carta de Pikachu?" (`GET /productos/pikachu`)
    *   *Backend*: "Sí, aquí están sus datos y precio" (Respuesta JSON)
*   **Tokens de Seguridad (JWT)**: Cuando un usuario entra, el Backend le entrega una "credencial digital" (Token). Cada vez que el usuario quiere ver sus órdenes privadas, muestra esa credencial. El Backend verifica la firma digital de la credencial antes de mostrar información confidencial.

---

## 💡 Por qué se eligieron estas tecnologías

| Tecnología | Razón (En palabras simples) |
| :--- | :--- |
| **React** | Es la herramienta más popular del mundo usada por Facebook e Instagram. Permite crear interfaces que se sienten vivas y rápidas. |
| **Node.js** | Permite usar el mismo lenguaje (JavaScript) en el servidor y en el cliente, lo que hace el desarrollo más rápido y unificado. |
| **TailwindCSS** | Permite "maquillar" y diseñar el sitio web muy rápido, asegurando que se vea bien en celulares y computadores sin escribir miles de líneas de código extra. |
| **Vite** | Es el motor que hace funcionar el entorno de desarrollo. Es extremadamente rápido, lo que permite a los programadores ver sus cambios en milisegundos. |

---

## 🔮 Futuro del Proyecto: Siguientes Pasos

Para llevar este proyecto a un nivel profesional "de producción", los siguientes pasos serían:
1.  **Base de Datos Real**: Conectar una base de datos permanente (como PostgreSQL o MongoDB) para que la información no se borre si el servidor se apaga.
2.  **Pasarela de Pagos**: Integrar WebPay o MercadoPago para aceptar dinero real.
3.  **Correos Automáticos**: Configurar un sistema para enviar un email de "Gracias por tu compra" automáticamente al cliente.
