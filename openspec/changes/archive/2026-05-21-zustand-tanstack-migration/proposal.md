## Why

Los stores de autenticación y carrito usan React Context + `useReducer`, un patrón verbose y boilerplate-heavy que requiere Providers, Actions, Reducers y Context separados para cada slice de estado. TanStack Query ya está adoptado para server state — la migración completa el modelo mental: **Zustand para client state, TanStack Query para server state**.

## What Changes

- `authStore.tsx`: reemplazar Context + `useReducer` + `AuthProvider` con store Zustand + middleware `persist` (localStorage)
- `cartStore.tsx`: reemplazar Context + `useReducer` + `CartProvider` con store Zustand + middleware `persist` (localStorage)
- `App.tsx` / `main.tsx`: eliminar los wrappers `<AuthProvider>` y `<CartProvider>`
- `frontend/package.json`: agregar dependencia `zustand`
- TanStack Query config: mejorar `QueryClient` con `staleTime`, `retry`, y `gcTime` por defecto
- Las interfaces públicas `useAuth()` y `useCart()` mantienen la misma API — los consumidores no cambian

## Capabilities

### New Capabilities
- `zustand-client-state`: Auth y Cart como Zustand stores con persist middleware — sin boilerplate de Context/Provider/Reducer

### Modified Capabilities
- `auth-linked-cart`: La lógica de "carrito vacío cuando no autenticado" se mantiene, pero la dependencia entre stores cambia de Context subscription a lectura directa del store de auth dentro del store de cart

## Impact

- **Instala**: `zustand` (+ types incluidos)
- **Modifica**: `frontend/src/stores/authStore.tsx`, `frontend/src/stores/cartStore.tsx`, `frontend/src/main.tsx`, `frontend/src/App.tsx`
- **No modifica**: hooks de data (`useProductos`, `usePedidos`, etc.) — ya usan TanStack Query v5
- **No modifica**: páginas ni componentes que consumen `useAuth()` / `useCart()` — la API externa no cambia
- **Riesgo bajo**: migración interna de implementación, comportamiento observable idéntico
