# Proposal: force-absolute-routing

## Why

El usuario reporta "pantalla vacía de ladrillos" al navegar. El código YA usa `<Link to="/productos">` en todos los lugares correctos (logo y "Volver a Productos"), pero el browser cachea las rutas viejas y la API se llama directo a `localhost:8000` sin proxy de Vite.

## What Changes

- Verificar que el logo usa `<Link to="/productos">` en ClientLayout.tsx (YA está)
- Verificar que "Volver a Productos" usa `<Link to="/productos">` en ProductoDetallePage.tsx (YA está)
- Forzar refresco completo del frontend eliminando cache de Vite
- Agregar reinicio en frio del container para limpiar caché

## Files

- `frontend/src/components/layout/ClientLayout.tsx`
- `frontend/src/pages/ProductoDetallePage.tsx`

## Risks

- Los cambios de routing ya están implementados — el problema es cache del browser/container
