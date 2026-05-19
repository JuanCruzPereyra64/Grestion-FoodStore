## Context

Hoy `CartProvider` envuelve a `App` en `main.tsx` desde afuera de `AuthProvider`. El carrito no sabe si hay sesión o no — cualquiera puede agregar items y ver el badge. Al hacer logout desde el dropdown de `ClientLayout`, solo se llama a `logout()` del authStore, sin tocar el carrito.

## Goals / Non-Goals

**Goals:**
- Carrito vacío (`[]`, 0 items, $0) cuando no hay sesión activa
- Logout limpia el carrito (items + localStorage)
- Botones "Agregar al carrito" redirigen a `/login` si no hay sesión
- Providers reordenados: `CartProvider` dentro de `AuthProvider`

**Non-Goals:**
- No se persiste carrito por usuario en backend (eso sería otro cambio con API)
- No se mergea carrito anónimo → autenticado (el carrito anónimo se pierde al hacer login)
- No se toca el checkout flow existente

## Decisions

### DEC-001: Reordenar providers — CartProvider dentro de AuthProvider

**Decisión:** En `main.tsx`, mover `CartProvider` dentro de `AuthProvider` (que está dentro de `App`). Así `CartProvider` puede acceder a `useAuth()`.

**Razón:** Necesitamos que el carrito conozca el estado de autenticación. La alternativa (pasar `isAuthenticated` como prop desde App) es más verbosa y menos mantenible.

```
Antes:                     Después:
QueryClientProvider        QueryClientProvider
  CartProvider               App (BrowserRouter + AuthProvider)
    App (BrowserRouter         CartProvider     ← ahora adentro
      + AuthProvider)

```

### DEC-002: CartProvider usa useAuth() internamente

**Decisión:** Dentro de `CartProvider`, llamar a `useAuth()` y condicionar `items`, `totalItems`, `totalPrice` y `addItem` según `state.isAuthenticated`.

**Razón:** El provider es el lugar correcto para aplicar la política transversal (auth → cart). Los componentes que usan `useCart()` no necesitan saber de auth.

### DEC-003: Logout orquestado desde el componente, no desde authStore

**Decisión:** No acoplar `authStore` con `cartStore`. En `ClientLayout.tsx`, el handler del botón "Cerrar sesión" ahora llama `logout()` + `clearCart()` + `navigate('/login')`.

**Razón:** Mantener los stores desacoplados. La orquestación pertenece al componente.

### DEC-004: Guard en botones "Agregar al carrito"

**Decisión:** `ProductosPage` y `ProductoDetallePage` importan `useAuth()` + `useNavigate()`. Antes de `addItem`, verifican `state.isAuthenticated`. Si false, `navigate('/login')`.

**Razón:** El guard en el botón es más directo que esperar a que `addItem` falle silenciosamente. Da feedback inmediato al usuario.

## Cambios en el código

### main.tsx
```tsx
// Antes:
<CartProvider>
  <App />
</CartProvider>

// Después: CartProvider se mueve DENTRO de App, que ya tiene AuthProvider
// main.tsx solo deja:
<App />
```

### App.tsx
```tsx
// CartProvider envuelve AppRoutes (adentro de AuthProvider)
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
```

### cartStore.tsx — conditional cart
```tsx
export function CartProvider({ children }: { children: ReactNode }) {
  const { state } = useAuth()  // ← nuevo
  const [localState, dispatch] = useReducer(cartReducer, { items: loadCart() })

  // Si no está autenticado, todo es vacío
  const isActive = state.isAuthenticated

  const items = isActive ? localState.items : []
  const totalItems = isActive ? localState.items.reduce(...) : 0
  const totalPrice = isActive ? localState.items.reduce(...) : 0

  const addItem = useCallback((producto, cantidad, excluded) => {
    if (!state.isAuthenticated) return  // ← safety guard
    dispatch({ type: 'ADD_ITEM', producto, cantidad, excludedIngredienteIds: excluded })
  }, [state.isAuthenticated])
  // ... resto igual
}
```

### ClientLayout.tsx — logout + clearCart
```tsx
// Donde hoy dice:
onClick={() => { logout(); navigate('/login'); setDropdownOpen(false) }}

// Cambia a:
onClick={() => { logout(); clearCart(); navigate('/login'); setDropdownOpen(false) }}
```

### ProductosPage.tsx — guard en addToCart
```tsx
const { state } = useAuth()
const navigate = useNavigate()

// En el onClick:
onClick={() => {
  if (!state.isAuthenticated) { navigate('/login'); return }
  addItem({ ...p, cantidad: 1 })
}}
```

### ProductoDetallePage.tsx — guard en handleAddToCart / handleToggleExclude
```tsx
const { state } = useAuth()
const navigate = useNavigate()

function handleAddToCart() {
  if (!state.isAuthenticated) { navigate('/login'); return }
  cart.addItem(p)
}

function handleToggleExclude(ingredienteId: number) {
  if (!state.isAuthenticated) { navigate('/login'); return }
  // ... lógica actual
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| `useAuth()` dentro de `CartProvider` crea dependencia circular si CartProvider está fuera de AuthProvider | Se resuelve moviendo CartProvider dentro de AuthProvider (DEC-001) |
| Usuario pierde items del carrito al hacer login | Es el comportamiento deseado: carrito anónimo no debe persistir. Si en el futuro se quiere merge, se agrega como otro cambio |
| Doble redirect: anónimo clickea "Agregar al carrito" → /login → post-login vuelve a /productos | El usuario llega a /login y al loguearse va a / (defaultPath para clientes). Es aceptable por ahora — mejoraría con redirect param (?redirect=/productos) pero está fuera del alcance |
