# Mejorar visibilidad de barra de búsqueda y filtros en el menú

**ID**: menu-search-filters-hotfix
**Tipo**: Hotfix UI
**Estado**: Archivado
**Prioridad**: Alta

## Why

La barra de búsqueda ("Buscá tu plato favorito...") y los filtros de categorías son casi invisibles sobre el fondo de ladrillos de la página de productos. Los elementos tienen fondo `bg-slate-800/50` que no contrasta lo suficiente con el fondo oscuro del sitio, dificultando la experiencia de navegación.

## What Changes

Aplicar el mismo efecto de **glassmorphism** que ya usan las tarjetas de productos (`bg-neutral-950/80 backdrop-blur-lg`) tanto al contenedor de la barra de búsqueda como a los filtros de categorías, y asegurar que todo el texto sea blanco (`text-white`) para máxima legibilidad.

### Cambios específicos

1. **Contenedor de filtros (search + categorías)**: Envolver ambos en un contenedor glass idéntico al de las cards de producto
2. **Barra de búsqueda**: Fondo `bg-black/60`, borde `border-slate-600/50`, placeholder `text-gray-400`
3. **Filtros de categorías**:
   - **Seleccionado**: `bg-primary text-white` (sin cambios)
   - **No seleccionado**: `bg-black/60 text-white border border-slate-600/50`

## Archivos modificados

- `frontend/src/pages/ProductosPage.tsx` — solo clases Tailwind, cero lógica

## Criterios de aceptación

- [x] La barra de búsqueda y filtros son perfectamente legibles sobre el fondo de ladrillos
- [x] Los filtros no seleccionados tienen texto blanco
- [x] El filtro seleccionado mantiene fondo naranja neón con texto blanco
- [x] El placeholder del search es visible (gris claro)
- [x] El glassmorphism es consistente con las tarjetas de productos
