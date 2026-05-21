# Spec: menu-search-visibility

## Overview

La barra de búsqueda y los filtros de categorías en la página de productos deben tener suficiente opacidad de fondo y desenfoque para ser legibles contra el fondo de ladrillos, siguiendo el mismo patrón glassmorphism de las tarjetas de producto.

## ADDED Requirements

### Requirement: Contenedor glass para search y filtros

El contenedor que agrupa la barra de búsqueda y los filtros de categorías SHALL usar un fondo oscuro translúcido con desenfoque (`bg-neutral-950/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 md:p-6`) para aislar estos elementos del fondo de la página.

#### Scenario: Contenedor protector visible
- **WHEN** se renderiza la sección de filtros en `/productos`
- **THEN** los elementos de búsqueda y categorías están dentro de un contenedor con `bg-neutral-950/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 md:p-6`
- **AND** el glassmorphism es consistente con las cards de producto

### Requirement: Fondo del input de búsqueda

El input de búsqueda SHALL usar fondo `bg-black/60` con borde `border border-slate-600/50` para mejor contraste.

#### Scenario: Input con fondo negro translúcido
- **WHEN** se renderiza el input de búsqueda
- **THEN** tiene `bg-black/60` y borde `border border-slate-600/50`

### Requirement: Placeholder del input legible

El texto placeholder del input de búsqueda SHALL ser visible con suficiente contraste.

#### Scenario: Placeholder gris claro
- **WHEN** el input de búsqueda está vacío
- **THEN** el placeholder muestra "Buscá tu plato favorito..." en `placeholder:text-gray-400`

### Requirement: Filtros no seleccionados con texto blanco

Los botones de filtro de categoría no seleccionados SHALL tener `bg-black/60 text-white border border-slate-600/50` para máxima legibilidad.

#### Scenario: Filtro inactivo legible
- **WHEN** un filtro de categoría NO está seleccionado
- **THEN** tiene `bg-black/60 text-white border border-slate-600/50`
- **AND** en hover muestra `hover:border-primary/30`

### Requirement: Filtro seleccionado mantiene estilo

El botón de filtro de categoría seleccionado SHALL mantener `bg-primary text-white`.

#### Scenario: Filtro activo con fondo naranja
- **WHEN** un filtro de categoría está seleccionado
- **THEN** tiene `bg-primary text-white` (sin cambios)

## Validación

- `npx tsc --noEmit` debe pasar sin errores
- Visualmente: todos los textos de search y filtros son legibles contra el fondo de ladrillos
