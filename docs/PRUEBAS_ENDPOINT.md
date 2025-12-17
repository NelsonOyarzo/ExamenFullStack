# 🧪 Guía de Pruebas Unitarias de Endpoints

Este documento detalla **17 Casos de Prueba** para validar la API. Cada prueba incluye el Método, URL, Tipo de Body y el JSON exacto para copiar y pegar en Postman.

---

## 🔐 1. Autenticación

### Caso 1.1: Registrar Usuario
*   **Método:** `POST`
*   **URL:** `http://localhost:3000/api/auth/register`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "nombre": "Alumno Duoc",
    "run": "20.123.456-7",
    "correo": "alumno@duocuc.cl",
    "contrasena": "examen123",
    "telefono": "+56912345678"
}
```

### Caso 1.2: Iniciar Sesión (Login)
*   **Método:** `POST`
*   **URL:** `http://localhost:3000/api/auth/login`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "correo": "admin@pokestore.cl",
    "contrasena": "admin123"
}
```

### Caso 1.3: Actualizar Perfil (Requiere Token)
*   **Método:** `PUT`
*   **URL:** `http://localhost:3000/api/auth/profile`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "telefono": "+56987654321",
    "direccion": {
        "calle": "Av. España 123",
        "comuna": "Santiago",
        "ciudad": "Santiago Centro",
        "region": "RM"
    }
}
```

---

## 📦 2. Gestión de Productos (Administrador)

### Caso 2.1: Crear Producto
*   **Método:** `POST`
*   **URL:** `http://localhost:3000/api/productos`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "nombre": "Charizard Ex",
    "set": "Obsidian Flames",
    "numeroSet": "223/197",
    "rareza": "Special Illustration Rare",
    "tipo": "Darkness",
    "precio": 85000,
    "stock": 10,
    "descripcion": "Carta muy rara de Charizard tipo siniestro",
    "estado": "Nuevo",
    "idioma": "Inglés"
}
```

### Caso 2.2: Actualizar Producto
*   **Método:** `PUT`
*   **URL:** `http://localhost:3000/api/productos/1`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "nombre": "Pikachu VMAX (Edited)",
    "set": "Vivid Voltage",
    "rareza": "Secret Rare",
    "tipo": "Electric",
    "precio": 48000,
    "stock": 5
}
```

### Caso 2.3: Actualizar Stock Rápido
*   **Método:** `PATCH`
*   **URL:** `http://localhost:3000/api/productos/1/stock`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "stock": 50
}
```

---

## 🛒 3. Carrito de Compras

### Caso 3.1: Agregar Item al Carrito
*   **Método:** `POST`
*   **URL:** `http://localhost:3000/api/carrito/items`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "productoId": 1,
    "cantidad": 2
}
```

### Caso 3.2: Actualizar Cantidad de Item
*   **Método:** `PUT`
*   **URL:** `http://localhost:3000/api/carrito/items/1`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "cantidad": 5
}
```

---

## 💳 4. Órdenes y Pagos

### Caso 4.1: Crear Orden (Finalizar Compra)
*   **Método:** `POST`
*   **URL:** `http://localhost:3000/api/ordenes`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "direccionEnvio": {
        "calle": "Calle Falsa 123",
        "comuna": "Providencia",
        "ciudad": "Santiago",
        "region": "Metropolitana"
    }
}
```

### Caso 4.2: Actualizar Estado de Orden (Admin)
*   **Método:** `PATCH`
*   **URL:** `http://localhost:3000/api/admin/ordenes/ORDEN_ID_AQUI/estado`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "estado": "Enviado"
}
```
*(Nota: Reemplazar `ORDEN_ID_AQUI` por un ID real de una orden creada)*

### Caso 4.3: Iniciar Pago Webpay
*   **Método:** `POST`
*   **URL:** `http://localhost:3000/api/webpay/create`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "amount": 15000
}
```

### Caso 4.4: Confirmar Pago Webpay (Simulación)
*   **Método:** `POST`
*   **URL:** `http://localhost:3000/api/webpay/commit`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "token": "01ab23cd45ef..."
}
```

---

## 👥 5. Gestión de Usuarios (Admin)

### Caso 5.1: Crear Usuario Administrativo
*   **Método:** `POST`
*   **URL:** `http://localhost:3000/api/users`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "nombre": "Soporte Técnico",
    "run": "15.555.555-5",
    "correo": "soporte@pokestore.cl",
    "contrasena": "soporte123",
    "rol": "Administrador"
}
```

### Caso 5.2: Editar Usuario
*   **Método:** `PUT`
*   **URL:** `http://localhost:3000/api/users/2`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "nombre": "Soporte Editado",
    "run": "15.555.555-5",
    "correo": "soporte@pokestore.cl",
    "rol": "Cliente"
}
```

---

## 📬 6. Soporte

### Caso 6.1: Enviar Mensaje de Contacto
*   **Método:** `POST`
*   **URL:** `http://localhost:3000/api/soporte`
*   **Tipo de Body:** `raw (JSON)`
```json
{
    "nombre": "Visitante Curioso",
    "correo": "visitante@gmail.com",
    "mensaje": "¿Tienen stock de cartas base set?"
}
```
