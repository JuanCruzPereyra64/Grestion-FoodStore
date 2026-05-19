## Why

Hoy la aplicación redirige automáticamente a `/login` sin importar qué ruta toque el usuario. La Landing Page (`/`) y todas las rutas de cliente (catálogo, envíos, descuentos, etc.) están secuestradas detrás de `ClientShell`, que exige autenticación. Un visitante que llega al sitio se encuentra con una pantalla de login sin haber visto nada del producto. Necesitamos que la Landing Page sea pública para mostrar la propuesta de valor, el catálogo y la marca antes de pedirle al usuario que se registre.

## What Changes

1. **Hacer pública la ruta `/` (Landing Page):** Eliminar el guard `ClientShell` de la ruta raíz. `ClientHomePage` se renderiza sin exigir autenticación. El navbar de cliente se muestra completo (excepto el dropdown de usuario para no-autenticados).

2. **Hacer públicas las rutas de contenido informativo:** `/conocenos`, `/envios`, `/descuentos` también deben ser accesibles sin autenticación. Son páginas informativas sin datos sensibles.

3. **Hacer público el catálogo de productos:** `/productos` y `/productos/:id` deben mostrar los productos sin necesidad de login. El carrito y checkout sí quedan protegidos.

4. **Conectar el ícono de avatar (User) a `/login`:** En el navbar de cliente, cambiar el botón de avatar actual para que:
   - **No autenticado:** muestre un ícono User que navegue a `/login` como un `<Link>`.
   - **Autenticado:** mantenga el dropdown actual con nombre, email, historial y cerrar sesión.

5. **Consolidar `/login` como ruta independiente:** Ya está standalone (sin layout), mantener así. No debe pisar el diseño de la Landing Page.

6. **Ajustar guards restantes:** Rutas de carrito (`/carrito`, `/checkout`, `/pago/*`) y de admin (`/admin/*`) mantienen su protección actual.

## Capabilities

### New Capabilities
- `public-landing-page`: Landing page pública con hero, features, CTA, catálogo visible sin autenticación
- `public-content-pages`: Páginas informativas (conocenos, envios, descuentos) accesibles sin login
- `public-catalog`: Catálogo de productos público con detalle de producto individual

### Modified Capabilities
<!-- None -- no global specs exist yet in openspec/specs/ -->

## Impact

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/App.tsx` | Modified | Separar rutas públicas de protegidas; `/`, `/conocenos`, `/envios`, `/descuentos`, `/productos`, `/productos/:id` fuera de `ClientShell` |
| `frontend/src/components/layout/ClientLayout.tsx` | Modified | Avatar condicional: si no autenticado → Link a `/login`; si autenticado → dropdown actual |
| `frontend/src/pages/LoginPage.tsx` | None | Ya es standalone sin layout, no necesita cambios |
| `frontend/src/stores/authStore.tsx` | None | No requiere cambios de lógica |
| `frontend/src/components/layout/ClientShell.tsx` | Removed/Refactored | Se elimina o se refactoriza para solo envolver rutas protegidas |
