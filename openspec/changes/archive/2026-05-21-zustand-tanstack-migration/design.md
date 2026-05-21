## Context

El frontend de FoodStore tiene dos capas de estado:

1. **Server state** (datos del servidor): `useProductos`, `usePedidos`, etc. — ya usan TanStack Query v5 con `QueryClientProvider` configurado en `main.tsx`. Esta capa está completa y no requiere cambios estructurales.

2. **Client state** (estado local de la app): `authStore.tsx` y `cartStore.tsx` usan React Context + `useReducer`. Este patrón requiere boilerplate significativo: Context, Provider, Reducer, Actions, hook de consumo. Los Providers deben envolver el árbol de componentes en `App.tsx`.

La migración apunta exclusivamente a la capa 2: reemplazar Context + Reducer con Zustand, completando el modelo mental **Zustand para client state, TanStack Query para server state**.

## Goals / Non-Goals

**Goals:**
- Eliminar el boilerplate de Context/Provider/Reducer en `authStore` y `cartStore`
- Mantener la persistencia en `localStorage` con el mismo key (`foodstore-auth`, `foodstore-cart`)
- Conservar la API pública de `useAuth()` y `useCart()` para que los consumidores no cambien
- Mejorar la configuración de `QueryClient` con defaults razonables

**Non-Goals:**
- Modificar los hooks de data (`useProductos`, `usePedidos`, etc.) — ya son correctos
- Cambiar el comportamiento observable de auth o carrito
- Agregar DevTools ni middlewares de logging
- Migrar a SSR

## Decisions

### D1: Zustand sobre Redux Toolkit / Jotai / Context

Zustand ofrece el ratio beneficio/complejidad más alto para stores pequeñas y sin jerarquía:
- Sin Actions, sin Reducers, sin Providers
- Acceso directo fuera del ciclo de React vía `useAuthStore.getState()` — necesario para que `cartStore` lea auth sin suscripción a Context
- `persist` middleware maneja localStorage sin `useEffect` manual
- TypeScript first-class

Redux Toolkit descartado por overhead (Actions, Reducers, Slices). Jotai descartado por modelo átomo — menos natural para stores con múltiples campos relacionados.

### D2: CartStore lee authStore vía `getState()` en tiempo de acción

En el patrón actual, `cartStore` usa `useAuth()` dentro del Provider (dependencia por Context). Con Zustand, `cartStore` puede leer el estado de auth directamente con `useAuthStore.getState().isAuthenticated` en el momento que ejecuta cada acción.

Esto elimina la dependencia de Provider nesting y permite que ambos stores sean independientes.

### D3: Mantener API pública idéntica

`useAuth()` y `useCart()` exportan exactamente los mismos campos que hoy:
- `useAuth()` → `{ state: { user, accessToken, refreshToken, isAuthenticated }, login, logout }`
- `useCart()` → `{ items, totalItems, totalPrice, addItem, removeItem, updateCantidad, toggleExcludeIngrediente, clearCart, itemInCart }`

Los consumidores (páginas, layouts) no se tocan.

### D4: Persist middleware de Zustand en lugar de `useEffect` + `localStorage`

El patrón actual usa `useEffect` para sincronizar estado a localStorage. Con `persist` middleware, Zustand maneja hidratación (carga inicial) y persistencia (cambios) automáticamente.

Configuración del middleware: `{ name: 'foodstore-auth', storage: createJSONStorage(() => localStorage) }`. La lógica de `pasadasLasTres()` (expiración de sesión a las 3am) se implementa como función `onRehydrateStorage` del middleware.

### D5: QueryClient con defaults de producción

Configuración actual: `new QueryClient()` sin opciones. Nueva configuración:
- `staleTime: 5 * 60 * 1000` — evita refetches innecesarios en navegación
- `retry: 1` — un solo retry en error (evita cascadas de requests fallidos)
- `gcTime: 10 * 60 * 1000` — mantiene cache en memoria 10 minutos

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| Hidratación de `cartStore` ejecuta antes que `authStore` | Zustand hidrata síncronamente desde localStorage — ambos stores disponibles antes del primer render |
| `pasadasLasTres()` en `onRehydrateStorage` no limpia en tiempo real | El comportamiento actual tampoco es reactivo — solo se evalúa al cargar la app. Sin cambio de comportamiento. |
| Zustand bundle size | ~1.1KB gzipped. Insignificante. |
| Conflicto de keys en localStorage | Mismas keys (`foodstore-auth`, `foodstore-cart`) — migración transparente, datos existentes se leen correctamente |

## Migration Plan

1. `npm install zustand` en `frontend/`
2. Reescribir `authStore.tsx` como Zustand store con `persist`
3. Reescribir `cartStore.tsx` como Zustand store con `persist`, usando `useAuthStore.getState()` en acciones
4. Actualizar `main.tsx`: mejorar `QueryClient` config
5. Actualizar `App.tsx`: eliminar `<AuthProvider>` y `<CartProvider>`
6. Verificar que todos los consumidores compilan sin cambios

**Rollback**: revertir los 5 archivos. Sin cambios de esquema ni migración de datos.
