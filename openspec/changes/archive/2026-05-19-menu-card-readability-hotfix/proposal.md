## Why

El contenido de texto en las tarjetas de producto del grid (`/productos`) compite visualmente con el fondo de ladrillos porque el contenedor `bg-slate-800/40` es muy translúcido. Nombres, descripciones en gris y badges de ingredientes se pierden contra el fondo. En el detalle (`/productos/:id`) el problema existe pero es menor porque el componente `Card` usa `dark:bg-[#1a1a1a]` sólido.

## What Changes

1. **Reforzar fondo del contenedor de contenido en grid cards:** Reemplazar `bg-slate-800/40` por `bg-neutral-950/80 backdrop-blur-lg` en el contenedor principal de cada card del grid. Esto da un fondo oscuro translúcido con desenfoque que aísla el texto del fondo de ladrillos.

2. **Aislar el panel de texto inferior:** El `div.p-5` (contenido: nombre, precio, descripción, ingredientes, botón) debe tener su propio fondo `bg-black/60 backdrop-blur-md` y extenderse ligeramente hacia arriba para cubrir la transición con la imagen. Usar `-mt-8 pt-12` o similar para superponerse al borde inferior de la imagen.

3. **Ajustar contraste de textos secundarios:** Descripciones de `text-slate-400` a `text-gray-300` e ingredientes de `text-slate-500` a `text-slate-400` en el grid.

4. **Detalle de producto (opcional):** Si la card de detalle también tiene problemas de legibilidad contra el fondo, agregar `backdrop-blur-lg` a la clase `premium-card` en el CSS.

## Capabilities

### New Capabilities
- `menu-card-readability`: Tarjetas de producto con fondo oscuro + desenfoque que aísla el texto del fondo de ladrillos

### Modified Capabilities
<!-- None -->

## Impact

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/pages/ProductosPage.tsx` | Modified | Card container: `bg-slate-800/40` → `bg-neutral-950/80 backdrop-blur-lg`; content panel aislado con `bg-black/60 backdrop-blur-md -mt-8 pt-12 rounded-b-2xl`; `text-slate-400` desc → `text-gray-300`; `text-slate-500` ing → `text-slate-400` |
| `frontend/src/index.css` | Modified (opcional) | Agregar `backdrop-blur-lg` a `.premium-card` si es necesario |
