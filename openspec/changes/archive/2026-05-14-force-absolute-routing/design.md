# Design: force-absolute-routing

## Context

Ambos puntos de navegación ya usan `<Link to="/productos">`:
- Logo: `ClientLayout.tsx:88` — `<Link to="/productos">`
- "Volver a Productos": `ProductoDetallePage.tsx:27,52` — `<Link to="/productos">`

No hay uso de `router.back()` ni `history.go()` en ninguna página del cliente.

## Decisions

### D1. No cambiar código de routing
- Ya está correcto. El problema es cache del lado del browser/container.
- No hay `router.back()` ni `navigate(-1)` en ProductoDetallePage ni en ningún componente cliente.

### D2. Forzar rebuild y hard refresh
- Eliminar container frontend y recrearlo desde cero
- Cliente debe hacer Ctrl+F5 (hard refresh) en el browser
