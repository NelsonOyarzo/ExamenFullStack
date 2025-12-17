# Plan de Reestructuración del Proyecto

El objetivo es organizar los archivos del proyecto moviendo el código fuente del Frontend a una carpeta `src/`.

## 1. Crear carpeta `src`
Esta carpeta contendrá todo el código fuente de la aplicación React.

## 2. Mover carpetas y archivos
Los siguientes elementos se moverán de la raíz a `src/`:
*   `components/`
*   `context/`
*   `pages/`
*   `services/`
*   `types/`
*   `utils/`
*   `App.tsx`
*   `index.tsx` (o `main.tsx`)
*   `types.ts`
*   `index.css` (si existe)

## 3. Archivos que se quedan en la raíz
*   `server/` (Backend debe estar separado)
*   `public/` (Archivos estáticos)
*   `docs/`
*   `tests/`
*   `index.html` (Vite requiere esto en raíz)
*   `vite.config.ts`, `tsconfig.json`, `package.json`, etc.

## 4. Actualizaciones de Configuración
### `index.html`
Actualizar la referencia del script de entrada:
```diff
- <script type="module" src="/index.tsx"></script>
+ <script type="module" src="/src/index.tsx"></script>
```

### `tsconfig.json` (Si es necesario)
Verificar que `include` contenga `src`.
