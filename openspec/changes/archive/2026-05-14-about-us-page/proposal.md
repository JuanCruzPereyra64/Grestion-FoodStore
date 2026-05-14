# Proposal: about-us-page

## Why

No existe una pagina "Conocenos" - actualmente solo hay un hash link roto (#conocenos) en el navbar que no lleva a ningun lado.

## What Changes

- Crear ConocenosPage.tsx con contenido completo (historia, datos random, cierre)
- Agregar ruta /conocenos en App.tsx
- Reemplazar hash link #conocenos por NavLink en navbar

## Files

- frontend/src/pages/ConocenosPage.tsx (NEW)
- frontend/src/App.tsx - route added
- frontend/src/components/layout/ClientLayout.tsx - NavLink
