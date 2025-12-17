# Requisitos del Sistema - PokéStore Chile

Este documento detalla los requisitos funcionales y no funcionales para la plataforma de venta de cartas Pokémon.

## 1. Requisitos Funcionales (RF)

Los requisitos funcionales describen lo que el sistema debe hacer.

### 🔐 Autenticación y Gestión de Usuarios
- **RF-001 Registro de Usuarios**: El sistema debe permitir el registro de nuevos clientes solicitando: Nombre Completo, RUN (con validación chilena), Correo (@pokestore.cl o @duocuc.cl), Contraseña y Teléfono.
- **RF-002 Inicio de Sesión**: El sistema debe permitir el ingreso mediante correo y contraseña.
- **RF-003 Gestión de Sesión**: El sistema debe mantener la sesión activa mediante Tokens (JWT) por un periodo definido (ej. 8 horas).
- **RF-004 Perfil de Usuario**: El usuario autenticado debe poder visualizar y editar sus datos personales (excepto correo y RUN).

### 🎴 Catálogo y Productos
- **RF-005 Listado de Productos**: El sistema debe mostrar el catálogo de cartas con imagen, nombre, precio y stock disponible.
- **RF-006 Filtros Avanzados**: El usuario debe poder filtrar productos por Rareza, Tipo (Fuego, Agua, etc.), Set y Rango de Precio.
- **RF-007 Búsqueda**: El sistema debe permitir buscar productos por nombre.
- **RF-008 Detalle de Producto**: Al seleccionar un producto, se debe mostrar su detalle completo, incluyendo descripción, número de set e idioma.

### 🛒 Carrito y Compras
- **RF-009 Gestión del Carrito**: Los usuarios autenticados deben poder agregar productos al carrito, modificar cantidades y eliminar ítems.
- **RF-010 Validación de Stock**: El sistema no debe permitir agregar más unidades de las disponibles en stock.
- **RF-011 Cálculo de Totales**: El carrito debe calcular automáticamente el subtotal, costo de envío ($3.000 o gratis sobre $50.000) y total a pagar.
- **RF-012 Generación de Orden**: El sistema debe permitir finalizar la compra, generando una orden con estado "Pendiente" y descontando el stock real.

### 🛡️ Administración (Back Office)
- **RF-013 Gestión de Productos (CRUD)**: El administrador debe poder Crear, Leer, Actualizar y Borrar productos.
- **RF-014 Control de Stock**: El administrador debe poder ajustar el stock de los productos.
- **RF-015 Gestión de Órdenes**: El administrador debe poder visualizar todas las órdenes y cambiar su estado (Confirmado, Enviado, Entregado).
- **RF-016 Estadísticas**: El panel debe mostrar métricas básicas como total de ventas, usuarios registrados y productos sin stock.

---

## 2. Requisitos No Funcionales (RNF)

Los requisitos no funcionales describen cómo debe comportarse el sistema.

### 🎨 Usabilidad y Diseño
- **RNF-001 Diseño Responsivo**: La aplicación debe adaptarse correctamente a dispositivos móviles, tablets y escritorio.
- **RNF-002 Interfaz Intuitiva**: Debe incluir retroalimentación visual (alertas, notificaciones toast) para acciones exitosas o errores.
- **RNF-003 Accesibilidad**: Soporte para temas Claro/Oscuro según preferencia del usuario o sistema.

### 🚀 Rendimiento
- **RNF-004 Carga Rápida**: El tiempo de carga inicial de la aplicación no debe superar los 3 segundos (SPA optimizada con Vite).
- **RNF-005 Filtrado Instantáneo**: Los filtros del catálogo deben aplicarse en menos de 500ms al trabajar con datos en memoria.

### 🔒 Seguridad
- **RNF-006 Protección de Contraseñas**: Las contraseñas no deben guardarse en texto plano; deben ser hasheadas (ej. bcrypt).
- **RNF-007 Validación de Datos**: Todos los datos de entrada (Frontend y Backend) deben ser validados para evitar inyecciones o datos corruptos.
- **RNF-008 Authorization**: Las rutas administrativas y de perfil deben estar protegidas, rechazando accesos sin token válido.

### 🏗️ Arquitectura
- **RNF-009 Stack Tecnológico**: El sistema debe implementarse usando el stack MERN/PERN (React + Node.js/Express).
- **RNF-010 Separación de Intereses**: El Frontend y Backend deben ser proyectos desplegables independientemente, comunicándose vía API REST.
