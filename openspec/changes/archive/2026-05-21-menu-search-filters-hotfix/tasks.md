# Tasks — menu-search-filters-hotfix

## Implementación

- [x] Envolver search + filtros en un contenedor glass (`bg-neutral-950/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 md:p-6`)
- [x] Cambiar fondo del input de búsqueda a `bg-black/60` con borde `border-slate-600/50`
- [x] Agregar `placeholder:text-gray-400` al input de búsqueda
- [x] Cambiar filtros no seleccionados a `bg-black/60 text-white border border-slate-600/50`
- [x] Verificar que filtro seleccionado mantiene `bg-primary text-white`

## Verificación

- [x] Compilar frontend sin errores: `npx tsc --noEmit`
- [x] Revisar visualmente que search y filtros sean legibles
- [x] Confirmar glassmorphism consistente con las cards de producto
