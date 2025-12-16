# 🚀 Quick Deploy Checklist - PokéStore Chile

## ✅ Pre-Deploy (Ya Completado)
- [x] Código actualizado con CORS para producción
- [x] Scripts de deployment agregados
- [x] Archivos de configuración creados
- [ ] Código subido a GitHub

## 📝 Deploy Backend (Render)

### Configuración
- [ ] Crear cuenta en render.com con GitHub
- [ ] New + → Web Service
- [ ] Conectar repositorio: pokestore-chile
- [ ] Configurar:
  - Name: `pokestore-api`
  - Build: `npm install`
  - Start: `node server/server.js`
  - Instance: Free

### Variables de Entorno
- [ ] `PORT` = `3000`
- [ ] `JWT_SECRET` = `pokestore-super-secret-jwt-key-2024-chile-tcg-secure`
- [ ] `NODE_ENV` = `production`
- [ ] `ALLOWED_ORIGINS` = `http://localhost:5173`

### Verificación
- [ ] Deploy completado (5-10 min)
- [ ] URL obtenida: `https://pokestore-api-____.onrender.com`
- [ ] Health check: `/api/health` responde OK

## 🎨 Deploy Frontend (Vercel)

### Configuración
- [ ] Crear cuenta en vercel.com con GitHub
- [ ] Add New → Project
- [ ] Importar repositorio: pokestore-chile
- [ ] Framework: Vite
- [ ] Build: `npm run build`
- [ ] Output: `dist`

### Variables de Entorno
- [ ] `VITE_API_URL` = `https://pokestore-api-____.onrender.com`

### Verificación
- [ ] Deploy completado (2-3 min)
- [ ] URL obtenida: `https://pokestore-chile.vercel.app`
- [ ] Sitio carga correctamente

## 🔄 Post-Deploy

### Actualizar CORS
- [ ] Ir a Render → Environment
- [ ] Editar `ALLOWED_ORIGINS`:
  ```
  http://localhost:5173,https://pokestore-chile.vercel.app
  ```
- [ ] Esperar redeploy (2-3 min)

### Testing Final
- [ ] Abrir frontend en navegador
- [ ] Catálogo carga las 10 cartas
- [ ] Login funciona (admin@pokestore.cl / admin123)
- [ ] Agregar al carrito funciona
- [ ] No hay errores en consola (F12)

## 🎉 Completado

URLs Finales:
- Frontend: `https://pokestore-chile.vercel.app`
- Backend: `https://pokestore-api-____.onrender.com`

---

## 🆘 Si algo falla:

1. **CORS Error**: Verifica ALLOWED_ORIGINS incluye tu URL de Vercel
2. **404 en API**: Verifica VITE_API_URL en Vercel
3. **Backend dormido**: Primera request tarda ~60s (normal en plan gratis)
4. **Build falla**: Revisa logs en Render/Vercel

---

**Tiempo estimado total**: 20-30 minutos
