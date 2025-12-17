// server.js - PokéStore Chile API
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const app = express();
app.use(helmet());

// CORS configuration for production
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors()); // Allow all origins for dev
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// ===== Root Endpoint =====
app.get('/', (req, res) => {
  res.send('Welcome to PokéStore Chile API! The server is running correctly.');
});

// ===== Datos en memoria (demo) =====
const users = [];
const productos = [];
const carritos = {}; // { userId: { items: [...] } }
const ordenes = [];
const mensajesSoporte = [];

// ===== Helpers RUT / validaciones =====
function normalizarRUN(rut) { return rut?.toString().replace(/\./g, '').replace(/-/g, '').toUpperCase() || ''; }
function dvRUN(num) {
  let M = 0, S = 1; for (; num; num = Math.floor(num / 10)) S = (S + num % 10 * (9 - M++ % 6)) % 11;
  return S ? S - 1 : 'K';
}
function validarRUN(rutCompleto) {
  const limpio = normalizarRUN(rutCompleto);
  const cuerpo = limpio.slice(0, -1), dv = limpio.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;
  const dvCalc = String(dvRUN(parseInt(cuerpo, 10)));
  return String(dv).toUpperCase() === dvCalc.toString();
}
function validarCorreo(c) { return /@(pokestore\.cl|duocuc\.cl)$/i.test(c || ''); }

// ===== Auth middleware =====
function authRequired(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, rol, correo, nombre }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
function adminOnly(req, res, next) {
  if (req.user?.rol !== 'Administrador') return res.status(403).json({ error: 'Solo Administrador' });
  next();
}

// ===== Seed Data =====
function seedData() {
  // Admin user
  const adminExists = users.find(u => u.correo === 'admin@pokestore.cl');
  if (!adminExists) {
    const hash = bcrypt.hashSync('admin123', 10);
    users.push({
      id: 1,
      nombre: 'Administrador',
      run: '11.111.111-1',
      correo: 'admin@pokestore.cl',
      contrasenaHash: hash,
      rol: 'Administrador',
      telefono: '+56912345678',
      direccion: null
    });
  }

  // Sample products
  if (productos.length === 0) {
    productos.push(
      {
        id: 1,
        nombre: 'Pikachu VMAX',
        set: 'Vivid Voltage',
        numeroSet: '188/185',
        rareza: 'Secret Rare',
        tipo: 'Electric',
        precio: 45000,
        stock: 3,
        imagen: 'https://images.pokemontcg.io/swsh4/188_hires.png',
        descripcion: 'Carta secreta de Pikachu VMAX con arte alternativo',
        estado: 'Nuevo',
        idioma: 'Inglés'
      },
      {
        id: 2,
        nombre: 'Charizard V',
        set: 'Brilliant Stars',
        numeroSet: '154/172',
        rareza: 'Ultra Rare',
        tipo: 'Fire',
        precio: 35000,
        stock: 5,
        imagen: 'https://images.pokemontcg.io/swsh9/154_hires.png',
        descripcion: 'Charizard V full art',
        estado: 'Nuevo',
        idioma: 'Inglés'
      },
      {
        id: 3,
        nombre: 'Mewtwo V',
        set: 'Pokémon GO',
        numeroSet: '30/78',
        rareza: 'Rare Holo V',
        tipo: 'Psychic',
        precio: 12000,
        stock: 10,
        imagen: 'https://images.pokemontcg.io/pgo/30_hires.png',
        descripcion: 'Mewtwo V del set Pokémon GO',
        estado: 'Nuevo',
        idioma: 'Inglés'
      },
      {
        id: 4,
        nombre: 'Umbreon VMAX',
        set: 'Evolving Skies',
        numeroSet: '215/203',
        rareza: 'Secret Rare',
        tipo: 'Darkness',
        precio: 85000,
        stock: 1,
        imagen: 'https://images.pokemontcg.io/swsh7/215_hires.png',
        descripcion: 'Umbreon VMAX alternate art - carta altamente cotizada',
        estado: 'Nuevo',
        idioma: 'Inglés'
      },
      {
        id: 5,
        nombre: 'Rayquaza VMAX',
        set: 'Evolving Skies',
        numeroSet: '111/203',
        rareza: 'Rare Holo VMAX',
        tipo: 'Dragon',
        precio: 28000,
        stock: 7,
        imagen: 'https://images.pokemontcg.io/swsh7/111_hires.png',
        descripcion: 'Rayquaza VMAX del popular set Evolving Skies',
        estado: 'Nuevo',
        idioma: 'Inglés'
      },
      {
        id: 6,
        nombre: 'Lugia V',
        set: 'Silver Tempest',
        numeroSet: '186/195',
        rareza: 'Ultra Rare',
        tipo: 'Colorless',
        precio: 22000,
        stock: 6,
        imagen: 'https://images.pokemontcg.io/swsh12/186_hires.png',
        descripcion: 'Lugia V full art del set Silver Tempest',
        estado: 'Nuevo',
        idioma: 'Inglés'
      },
      {
        id: 7,
        nombre: 'Giratina VSTAR',
        set: 'Lost Origin',
        numeroSet: '131/196',
        rareza: 'Rare Holo VSTAR',
        tipo: 'Dragon',
        precio: 18000,
        stock: 8,
        imagen: 'https://images.pokemontcg.io/swsh11/131_hires.png',
        descripcion: 'Giratina VSTAR - carta competitiva del meta actual',
        estado: 'Nuevo',
        idioma: 'Inglés'
      },
      {
        id: 8,
        nombre: 'Mew VMAX',
        set: 'Fusion Strike',
        numeroSet: '114/264',
        rareza: 'Rare Holo VMAX',
        tipo: 'Psychic',
        precio: 15000,
        stock: 12,
        imagen: 'https://images.pokemontcg.io/swsh8/114_hires.png',
        descripcion: 'Mew VMAX - excelente carta para mazos Fusion',
        estado: 'Nuevo',
        idioma: 'Inglés'
      },
      {
        id: 9,
        nombre: 'Leafeon V',
        set: 'Evolving Skies',
        numeroSet: '7/203',
        rareza: 'Rare Holo V',
        tipo: 'Grass',
        precio: 8000,
        stock: 15,
        imagen: 'https://images.pokemontcg.io/swsh7/7_hires.png',
        descripcion: 'Leafeon V del set Evolving Skies',
        estado: 'Nuevo',
        idioma: 'Inglés'
      },
      {
        id: 10,
        nombre: 'Arceus VSTAR',
        set: 'Brilliant Stars',
        numeroSet: '123/172',
        rareza: 'Rare Holo VSTAR',
        tipo: 'Colorless',
        precio: 25000,
        stock: 4,
        imagen: 'https://images.pokemontcg.io/swsh9/123_hires.png',
        descripcion: 'Arceus VSTAR - carta fundamental en el meta competitivo',
        estado: 'Nuevo',
        idioma: 'Inglés'
      }
    );
  }
}
seedData();

// ===== Health =====
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// ===== Auth =====
app.post('/api/auth/register', (req, res) => {
  let { nombre, run, correo, contrasena, telefono } = req.body || {};
  if (!nombre || !run || !correo || !contrasena) return res.status(400).json({ error: 'Campos requeridos' });
  if (!validarRUN(run)) return res.status(400).json({ error: 'RUN inválido' });
  if (!validarCorreo(correo)) return res.status(400).json({ error: 'Correo debe ser @pokestore.cl o @duocuc.cl' });
  if (users.some(u => u.correo === correo)) return res.status(409).json({ error: 'Correo ya registrado' });
  if (users.some(u => normalizarRUN(u.run) === normalizarRUN(run))) return res.status(409).json({ error: 'RUN ya registrado' });

  const rol = 'Cliente';
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const contrasenaHash = bcrypt.hashSync(contrasena, 10);
  const nuevo = { id, nombre, run, correo, contrasenaHash, rol, telefono: telefono || null, direccion: null };
  users.push(nuevo);
  return res.status(201).json({ id, nombre, run, correo, rol, telefono: telefono || null });
});

app.post('/api/auth/login', (req, res) => {
  const { correo, contrasena } = req.body || {};
  console.log('Login attempt:', { correo, contrasena }); // Debug log
  const user = users.find(u => u.correo === correo);
  if (!user) {
    console.log('User not found');
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const ok = bcrypt.compareSync(contrasena || '', user.contrasenaHash);
  if (!ok) {
    console.log('Wrong password');
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  console.log('Login successful for:', user.nombre);
  const token = jwt.sign({ id: user.id, rol: user.rol, correo: user.correo, nombre: user.nombre }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol } });
});

app.get('/api/auth/profile', authRequired, (req, res) => {
  const u = users.find(x => x.id === req.user.id);
  if (!u) return res.status(404).json({ error: 'No encontrado' });
  const { contrasenaHash, ...rest } = u;
  res.json(rest);
});

app.put('/api/auth/profile', authRequired, (req, res) => {
  const idx = users.findIndex(x => x.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  const { nombre, telefono, direccion } = req.body || {};
  if (nombre) users[idx].nombre = nombre;
  if (telefono) users[idx].telefono = telefono;
  if (direccion) users[idx].direccion = direccion;
  const { contrasenaHash, ...rest } = users[idx];
  res.json(rest);
});

// ===== Users (Admin) =====
app.get('/api/users', authRequired, adminOnly, (req, res) => res.json(users.map(({ contrasenaHash, ...rest }) => rest)));

app.get('/api/users/:id', authRequired, adminOnly, (req, res) => {
  const u = users.find(x => x.id === Number(req.params.id));
  if (!u) return res.status(404).json({ error: 'No encontrado' });
  const { contrasenaHash, ...rest } = u;
  res.json(rest);
});

app.post('/api/users', authRequired, adminOnly, (req, res) => {
  const { nombre, run, correo, contrasena, rol = 'Cliente', telefono } = req.body || {};
  if (!nombre || !run || !correo || !contrasena) return res.status(400).json({ error: 'Campos requeridos' });
  if (!validarRUN(run)) return res.status(400).json({ error: 'RUN inválido' });
  if (users.some(u => u.correo === correo)) return res.status(409).json({ error: 'Correo ya registrado' });
  if (users.some(u => normalizarRUN(u.run) === normalizarRUN(run))) return res.status(409).json({ error: 'RUN ya registrado' });
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const contrasenaHash = bcrypt.hashSync(contrasena, 10);
  const nuevo = { id, nombre, run, correo, contrasenaHash, rol, telefono: telefono || null, direccion: null };
  users.push(nuevo);
  const { contrasenaHash: _, ...rest } = nuevo;
  res.status(201).json(rest);
});

app.put('/api/users/:id', authRequired, adminOnly, (req, res) => {
  const idx = users.findIndex(x => x.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  const { nombre, run, correo, rol, telefono } = req.body || {};
  if (!nombre || !run || !correo || !rol) return res.status(400).json({ error: 'Campos requeridos' });
  if (!validarRUN(run)) return res.status(400).json({ error: 'RUN inválido' });
  users[idx] = { ...users[idx], nombre, run, correo, rol, telefono: telefono || users[idx].telefono };
  const { contrasenaHash, ...rest } = users[idx];
  res.json(rest);
});

app.delete('/api/users/:id', authRequired, adminOnly, (req, res) => {
  const idx = users.findIndex(x => x.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  const [delu] = users.splice(idx, 1);
  const { contrasenaHash, ...rest } = delu;
  res.json(rest);
});

// ===== Productos (Cartas Pokémon) =====
app.get('/api/productos', (req, res) => {
  let result = [...productos];
  const { rareza, tipo, set, precioMin, precioMax, buscar, ordenar } = req.query;

  // Filtros
  if (rareza) result = result.filter(p => p.rareza === rareza);
  if (tipo) result = result.filter(p => p.tipo === tipo);
  if (set) result = result.filter(p => p.set === set);
  if (precioMin) result = result.filter(p => p.precio >= Number(precioMin));
  if (precioMax) result = result.filter(p => p.precio <= Number(precioMax));
  if (buscar) {
    const term = buscar.toLowerCase();
    result = result.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.set.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term)
    );
  }

  // Ordenamiento
  if (ordenar === 'precio-asc') result.sort((a, b) => a.precio - b.precio);
  if (ordenar === 'precio-desc') result.sort((a, b) => b.precio - a.precio);
  if (ordenar === 'nombre') result.sort((a, b) => a.nombre.localeCompare(b.nombre));
  if (ordenar === 'stock') result.sort((a, b) => b.stock - a.stock);

  res.json(result);
});

app.get('/api/productos/:id', (req, res) => {
  const p = productos.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(p);
});

app.post('/api/productos', authRequired, adminOnly, (req, res) => {
  const { nombre, set, numeroSet, rareza, tipo, precio, stock, imagen, descripcion, estado, idioma } = req.body || {};
  if (!nombre || !set || !rareza || !tipo || precio === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Campos requeridos: nombre, set, rareza, tipo, precio, stock' });
  }
  if (precio < 0) return res.status(400).json({ error: 'Precio debe ser positivo' });
  if (stock < 0) return res.status(400).json({ error: 'Stock debe ser positivo' });

  const id = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;
  const nuevo = {
    id, nombre, set, numeroSet: numeroSet || '', rareza, tipo, precio, stock,
    imagen: imagen || '', descripcion: descripcion || '',
    estado: estado || 'Nuevo', idioma: idioma || 'Inglés'
  };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

app.put('/api/productos/:id', authRequired, adminOnly, (req, res) => {
  const idx = productos.findIndex(x => x.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  const { nombre, set, numeroSet, rareza, tipo, precio, stock, imagen, descripcion, estado, idioma } = req.body || {};
  if (!nombre || !set || !rareza || !tipo || precio === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Campos requeridos' });
  }
  if (precio < 0) return res.status(400).json({ error: 'Precio debe ser positivo' });
  if (stock < 0) return res.status(400).json({ error: 'Stock debe ser positivo' });

  productos[idx] = {
    ...productos[idx],
    nombre, set, numeroSet: numeroSet || '', rareza, tipo, precio, stock,
    imagen: imagen || productos[idx].imagen,
    descripcion: descripcion || '',
    estado: estado || 'Nuevo',
    idioma: idioma || 'Inglés'
  };
  res.json(productos[idx]);
});

app.patch('/api/productos/:id/stock', authRequired, adminOnly, (req, res) => {
  const idx = productos.findIndex(x => x.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  const { stock } = req.body || {};
  if (stock === undefined || stock < 0) return res.status(400).json({ error: 'Stock inválido' });
  productos[idx].stock = stock;
  res.json(productos[idx]);
});

app.delete('/api/productos/:id', authRequired, adminOnly, (req, res) => {
  const idx = productos.findIndex(x => x.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  const [delp] = productos.splice(idx, 1);
  res.json(delp);
});

// ===== Carrito =====
app.get('/api/carrito', authRequired, (req, res) => {
  const userId = req.user.id;
  const carrito = carritos[userId] || { items: [] };

  // Enriquecer con datos de productos
  const itemsEnriquecidos = carrito.items.map(item => {
    const producto = productos.find(p => p.id === item.productoId);
    return {
      ...item,
      producto: producto || null
    };
  }).filter(item => item.producto !== null);

  const subtotal = itemsEnriquecidos.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  const envio = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + envio;

  res.json({ items: itemsEnriquecidos, subtotal, envio, total });
});

app.post('/api/carrito/items', authRequired, (req, res) => {
  const userId = req.user.id;
  const { productoId, cantidad } = req.body || {};

  if (!productoId || !cantidad || cantidad <= 0) {
    return res.status(400).json({ error: 'productoId y cantidad son requeridos' });
  }

  const producto = productos.find(p => p.id === productoId);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  if (!carritos[userId]) carritos[userId] = { items: [] };

  const existente = carritos[userId].items.find(i => i.productoId === productoId);
  const cantidadTotal = existente ? existente.cantidad + cantidad : cantidad;

  if (cantidadTotal > producto.stock) {
    return res.status(400).json({ error: `Stock insuficiente. Disponible: ${producto.stock}` });
  }

  if (existente) {
    existente.cantidad = cantidadTotal;
  } else {
    carritos[userId].items.push({ productoId, cantidad });
  }

  res.json({ ok: true, mensaje: 'Producto agregado al carrito' });
});

app.put('/api/carrito/items/:productoId', authRequired, (req, res) => {
  const userId = req.user.id;
  const productoId = Number(req.params.productoId);
  const { cantidad } = req.body || {};

  if (!cantidad || cantidad <= 0) return res.status(400).json({ error: 'Cantidad inválida' });

  const producto = productos.find(p => p.id === productoId);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  if (cantidad > producto.stock) {
    return res.status(400).json({ error: `Stock insuficiente. Disponible: ${producto.stock}` });
  }

  if (!carritos[userId]) return res.status(404).json({ error: 'Carrito vacío' });

  const item = carritos[userId].items.find(i => i.productoId === productoId);
  if (!item) return res.status(404).json({ error: 'Item no encontrado en carrito' });

  item.cantidad = cantidad;
  res.json({ ok: true, mensaje: 'Cantidad actualizada' });
});

app.delete('/api/carrito/items/:productoId', authRequired, (req, res) => {
  const userId = req.user.id;
  const productoId = Number(req.params.productoId);

  if (!carritos[userId]) return res.status(404).json({ error: 'Carrito vacío' });

  carritos[userId].items = carritos[userId].items.filter(i => i.productoId !== productoId);
  res.json({ ok: true, mensaje: 'Item eliminado del carrito' });
});

app.delete('/api/carrito', authRequired, (req, res) => {
  const userId = req.user.id;
  carritos[userId] = { items: [] };
  res.json({ ok: true, mensaje: 'Carrito vaciado' });
});

// ===== Órdenes =====
app.get('/api/ordenes', authRequired, (req, res) => {
  const userOrdenes = ordenes.filter(o => o.usuarioId === req.user.id);
  res.json(userOrdenes);
});

app.get('/api/ordenes/:id', authRequired, (req, res) => {
  const orden = ordenes.find(o => o.id === req.params.id);
  if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
  if (orden.usuarioId !== req.user.id && req.user.rol !== 'Administrador') {
    return res.status(403).json({ error: 'No autorizado' });
  }
  res.json(orden);
});

app.post('/api/ordenes', authRequired, (req, res) => {
  const userId = req.user.id;
  const { direccionEnvio } = req.body || {};

  if (!direccionEnvio || !direccionEnvio.calle || !direccionEnvio.comuna || !direccionEnvio.ciudad || !direccionEnvio.region) {
    return res.status(400).json({ error: 'Dirección de envío completa es requerida' });
  }

  const carrito = carritos[userId];
  if (!carrito || carrito.items.length === 0) {
    return res.status(400).json({ error: 'Carrito vacío' });
  }

  // Validar stock y calcular totales
  const items = [];
  let subtotal = 0;

  for (const item of carrito.items) {
    const producto = productos.find(p => p.id === item.productoId);
    if (!producto) return res.status(404).json({ error: `Producto ${item.productoId} no encontrado` });
    if (producto.stock < item.cantidad) {
      return res.status(400).json({ error: `Stock insuficiente para ${producto.nombre}` });
    }

    items.push({
      productoId: producto.id,
      nombreProducto: producto.nombre,
      cantidad: item.cantidad,
      precioUnitario: producto.precio
    });
    subtotal += producto.precio * item.cantidad;
  }

  const envio = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + envio;

  // Crear orden
  const ordenId = uuid();
  const nuevaOrden = {
    id: ordenId,
    usuarioId: userId,
    items,
    subtotal,
    envio,
    total,
    estado: 'Pendiente',
    direccionEnvio,
    fechaCreacion: Date.now(),
    fechaActualizacion: Date.now()
  };

  ordenes.push(nuevaOrden);

  // Reducir stock
  for (const item of carrito.items) {
    const producto = productos.find(p => p.id === item.productoId);
    producto.stock -= item.cantidad;
  }

  // Vaciar carrito
  carritos[userId] = { items: [] };

  res.status(201).json(nuevaOrden);
});

// ===== Órdenes Admin =====
app.get('/api/admin/ordenes', authRequired, adminOnly, (req, res) => {
  const { estado } = req.query;
  let result = [...ordenes];
  if (estado) result = result.filter(o => o.estado === estado);
  res.json(result);
});

app.patch('/api/admin/ordenes/:id/estado', authRequired, adminOnly, (req, res) => {
  const idx = ordenes.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Orden no encontrada' });
  const { estado } = req.body || {};
  const estadosValidos = ['Pendiente', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado'];
  if (!estado || !estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }
  ordenes[idx].estado = estado;
  ordenes[idx].fechaActualizacion = Date.now();
  res.json(ordenes[idx]);
});

// ===== Soporte =====
app.post('/api/soporte', (req, res) => {
  const { nombre, correo, mensaje } = req.body || {};
  if (!nombre || !correo || !mensaje) return res.status(400).json({ error: 'Campos requeridos' });
  const item = { id: uuid(), nombre, correo, mensaje, ts: Date.now() };
  mensajesSoporte.push(item);
  res.status(201).json({ ok: true, recibido: item.id });
});

app.get('/api/admin/soporte', authRequired, adminOnly, (req, res) => {
  res.json(mensajesSoporte);
});

// ===== Stats para Admin =====
app.get('/api/admin/stats', authRequired, adminOnly, (req, res) => {
  const totalProductos = productos.length;
  const totalOrdenes = ordenes.length;
  const totalUsuarios = users.filter(u => u.rol === 'Cliente').length;
  const ventasTotales = ordenes.reduce((sum, o) => sum + o.total, 0);
  const ordenesPendientes = ordenes.filter(o => o.estado === 'Pendiente').length;
  const productosAgotados = productos.filter(p => p.stock === 0).length;

  res.json({
    totalProductos,
    totalOrdenes,
    totalUsuarios,
    ventasTotales,
    ordenesPendientes,
    productosAgotados
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🎴 PokéStore API escuchando en http://localhost:${PORT}`));

module.exports = app;
