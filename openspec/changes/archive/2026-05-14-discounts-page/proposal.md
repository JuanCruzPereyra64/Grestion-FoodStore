# Proposal: discounts-page

## Why

El link "Descuentos" en el navbar era un hash link roto (#descuentos). No existia una pagina de promociones.

## What Changes

- Crear DescuentosPage.tsx con contenido completo (martes de reset, combos permanentes)
- Agregar ruta /descuentos en App.tsx
- Reemplazar hash link #descuentos por NavLink en navbar

## Files

- frontend/src/pages/DescuentosPage.tsx (NEW)
- frontend/src/App.tsx - route added
- frontend/src/components/layout/ClientLayout.tsx - NavLink
