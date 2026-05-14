# Proposal: shipping-info-page

## Why

El link "Envios" en el navbar era un hash link roto (#envios). No existia una pagina de informacion logistica.

## What Changes

- Crear EnviosPage.tsx con contenido completo (cobertura, compromisos, tarifas)
- Agregar ruta /envios en App.tsx
- Reemplazar hash link #envios por NavLink en navbar

## Files

- frontend/src/pages/EnviosPage.tsx (NEW)
- frontend/src/App.tsx - route added
- frontend/src/components/layout/ClientLayout.tsx - NavLink
