## Why

Hoy el carrito (`cartStore`) es completamente independiente de la sesión: cualquier usuario anónimo puede agregar productos, ver el badge en el navbar con items, y el carrito persiste en localStorage aunque no haya nadie logueado. Esto no tiene sentido — el carrito es un recurso de usuario autenticado. Un visitante anónimo no debería ver items en el carrito ni poder agregar productos sin antes iniciar sesión.

## What Changes

1. **Validación de sesión en el carrito:** El `cartStore` debe leer el estado de autenticación. Si `isAuthenticated = false`, los métodos `addItem`, `items`, `totalItems`, `totalPrice` deben comportarse como si el carrito estuviera vacío ( `[]` items, 0 totalItems, $0 totalPrice).

2. **Limpieza al cerrar sesión:** La función `logout` en `authStore` debe encadenar un `clearCart` del `cartStore` para vaciar items y limpiar `localStorage` del carrito.

3. **Redirección al agregar sin sesión:** El botón "Agregar al carrito" en `ProductosPage` y `ProductoDetallePage` debe verificar si hay sesión activa. Si no, redirigir a `/login` en vez de agregar el producto.

4. **Ajustar `CartProvider` y orden de providers:** `CartProvider` necesita acceso a `AuthContext`, así que debe moverse dentro de `AuthProvider` en el árbol de React.

## Capabilities

### New Capabilities
- `auth-linked-cart`: Carrito de compras vinculado al estado de autenticación — vacío sin sesión, se limpia al logout, bloquea add-to-cart para anónimos

### Modified Capabilities
<!-- None -- no global specs exist yet in openspec/specs/ -->

## Impact

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/stores/cartStore.tsx` | Modified | Inyectar dependencia de `useAuth()` para validar sesión en `addItem`, `items`, `totalItems`, `totalPrice` |
| `frontend/src/stores/authStore.tsx` | Modified | El logout debe disparar `clearCart` |
| `frontend/src/main.tsx` | Modified | Mover `CartProvider` dentro de `AuthProvider` para que tenga acceso al contexto de auth |
| `frontend/src/pages/ProductosPage.tsx` | Modified | Botón "Agregar al carrito" redirige a `/login` si no hay sesión |
| `frontend/src/pages/ProductoDetallePage.tsx` | Modified | `handleAddToCart` y `handleToggleExclude` redirigen a `/login` si no hay sesión |
