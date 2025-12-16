# 📦 Guía: Subir PokéStore a GitHub

## Paso 1: Verificar Git

Verifica si ya tienes git inicializado:

```bash
git status
```

Si ves un error, inicializa git:

```bash
git init
```

## Paso 2: Agregar Archivos

```bash
# Ver qué archivos se agregarán
git status

# Agregar todos los archivos
git add .

# Verificar que .env NO esté incluido
git status
# Deberías ver que .env está ignorado
```

## Paso 3: Hacer Commit

```bash
git commit -m "Initial commit - PokéStore Chile TCG Store"
```

## Paso 4: Crear Repositorio en GitHub

### Opción A: Desde la Web (Más Fácil)

1. Ve a https://github.com
2. Click en el **"+"** arriba a la derecha → **"New repository"**
3. Configuración:
   ```
   Repository name: pokestore-chile
   Description: Tienda online de cartas Pokémon TCG para Chile
   Visibility: Public (o Private si prefieres)
   ❌ NO marcar "Add a README file"
   ❌ NO marcar "Add .gitignore"
   ❌ NO marcar "Choose a license"
   ```
4. Click **"Create repository"**

### Opción B: Desde GitHub CLI (Avanzado)

```bash
gh repo create pokestore-chile --public --source=. --remote=origin --push
```

## Paso 5: Conectar con GitHub

Después de crear el repo en GitHub, verás instrucciones. Usa estas:

```bash
# Agregar remote
git remote add origin https://github.com/TU-USUARIO/pokestore-chile.git

# Cambiar a rama main
git branch -M main

# Subir código
git push -u origin main
```

**Reemplaza `TU-USUARIO`** con tu nombre de usuario de GitHub.

## Paso 6: Verificar

1. Refresca la página de tu repositorio en GitHub
2. Deberías ver todos tus archivos
3. Verifica que `.env` NO esté visible (debe estar ignorado)

## ✅ ¡Listo para Deploy!

Ahora que tu código está en GitHub, puedes continuar con el deployment en Render y Vercel.

---

## 🔐 Importante: Seguridad

### Archivos que NO deben estar en GitHub:
- ❌ `.env` (contiene secretos)
- ❌ `node_modules/` (muy pesado)
- ❌ `dist/` (se genera en build)

### Archivos que SÍ deben estar:
- ✅ `.env.example` (template sin valores reales)
- ✅ `.gitignore` (lista de archivos a ignorar)
- ✅ Todo el código fuente

---

## 🆘 Troubleshooting

### Error: "remote origin already exists"

```bash
# Eliminar remote existente
git remote remove origin

# Agregar de nuevo
git remote add origin https://github.com/TU-USUARIO/pokestore-chile.git
```

### Error: ".env está en el repositorio"

Si accidentalmente subiste .env:

```bash
# Eliminar del repositorio (pero mantener local)
git rm --cached .env

# Commit
git commit -m "Remove .env from repository"

# Push
git push
```

### Error: "Permission denied"

Necesitas autenticarte con GitHub:
1. Usa GitHub Desktop (más fácil)
2. O configura SSH keys
3. O usa Personal Access Token

---

## 📱 Alternativa: GitHub Desktop (Recomendado para Principiantes)

1. Descarga GitHub Desktop: https://desktop.github.com
2. Instala y abre
3. File → Add Local Repository
4. Selecciona tu carpeta `ExamenFullstack`
5. Click "Publish repository"
6. Marca "Public" o "Private"
7. Click "Publish"

¡Mucho más fácil! 😊

---

## ➡️ Siguiente Paso

Una vez que tu código esté en GitHub, continúa con:
- **[deploy_paso_a_paso.md](file:///C:/Users/nelca/.gemini/antigravity/brain/e7873dbe-3110-4da0-afbc-9ab4e8c68194/deploy_paso_a_paso.md)** - Guía completa de deployment
- **[DEPLOY_CHECKLIST.md](file:///c:/Users/nelca/Desktop/ExamenFullstack/DEPLOY_CHECKLIST.md)** - Checklist rápido
