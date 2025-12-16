# PokéStore Chile - Tienda de Cartas Pokémon TCG

Tienda online de cartas Pokémon Trading Card Game para el mercado chileno.

## 🎴 Características

- **Catálogo Completo**: Navega por cientos de cartas Pokémon con filtros avanzados
- **Carrito de Compras**: Sistema completo de carrito con gestión de stock
- **Autenticación**: Sistema seguro con JWT y validación de RUN chileno
- **Panel Admin**: Gestión de productos, órdenes y usuarios
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Modo Oscuro**: Tema claro/oscuro automático

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar backend (puerto 3000)
npm start

# En otra terminal, iniciar frontend (puerto 5173)
npm run dev
```

Visita `http://localhost:5173` para ver la aplicación.

## 📦 Stack Tecnológico

- **Frontend**: React 18.2 + TypeScript + Vite
- **Estilos**: TailwindCSS (CDN)
- **Backend**: Express 4.18 + JWT + bcrypt
- **Routing**: React Router DOM 6
- **Estado**: React Context API

## 🔐 Credenciales de Prueba

### Administrador
- **Correo**: admin@pokestore.cl
- **Contraseña**: admin123

### Registro de Cliente
- Correos válidos: `@pokestore.cl` o `@duocuc.cl`
- RUN debe ser válido (módulo 11)

## 📋 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Perfil del usuario

### Productos
- `GET /api/productos` - Listar productos (con filtros)
- `GET /api/productos/:id` - Detalle de producto
- `POST /api/productos` - Crear producto (Admin)
- `PUT /api/productos/:id` - Actualizar producto (Admin)
- `DELETE /api/productos/:id` - Eliminar producto (Admin)

### Carrito
- `GET /api/carrito` - Obtener carrito
- `POST /api/carrito/items` - Agregar item
- `PUT /api/carrito/items/:id` - Actualizar cantidad
- `DELETE /api/carrito/items/:id` - Eliminar item

### Órdenes
- `GET /api/ordenes` - Mis órdenes
- `POST /api/ordenes` - Crear orden
- `GET /api/admin/ordenes` - Todas las órdenes (Admin)

## 🎨 Paleta de Colores

```javascript
{
  'pokemon-red': '#EE1515',
  'pokemon-blue': '#3B4CCA',
  'pokemon-yellow': '#FFDE00',
  'electric': '#F7D02C',
  'fire': '#F08030',
  'water': '#6890F0',
  'grass': '#78C850',
  // ... más colores por tipo
}
```

## 📁 Estructura del Proyecto

```
├── server/
│   └── server.js          # Backend Express
├── pages/                 # Páginas React
│   ├── HomePage.tsx
│   ├── CatalogPage.tsx
│   ├── CartPage.tsx
│   └── ...
├── components/            # Componentes reutilizables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── ...
├── context/              # React Context
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── services/             # API services
│   ├── authService.ts
│   ├── productService.ts
│   ├── cartService.ts
│   └── orderService.ts
└── types.ts              # TypeScript types
```

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Desarrollo frontend (Vite)
npm run build    # Build producción
npm start        # Iniciar backend
npm run preview  # Preview build
```

## 🌟 Productos de Ejemplo

El backend incluye 10 cartas de ejemplo:
- Pikachu VMAX (Secret Rare) - $45.000
- Charizard V (Ultra Rare) - $35.000
- Umbreon VMAX (Secret Rare) - $85.000
- Y más...

## 📝 Validaciones

### RUN (RUT Chileno)
- Formato: `11.111.111-1` o `111111111`
- Validación con módulo 11

### Correo Electrónico
- Solo dominios: `@pokestore.cl` y `@duocuc.cl`

### Stock
- No se puede agregar más cantidad que stock disponible
- Stock se reduce automáticamente al crear orden

## 🚚 Envíos

- **Costo**: $3.000 CLP
- **Envío Gratis**: En compras sobre $50.000

## ⚠️ Notas Importantes

- **Persistencia**: Los datos se almacenan en memoria (se pierden al reiniciar)
- **Pagos**: No incluye integración de pasarela de pagos
- **Producción**: Requiere base de datos para uso real