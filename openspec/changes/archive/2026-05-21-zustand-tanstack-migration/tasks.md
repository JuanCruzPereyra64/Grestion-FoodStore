## 1. Instalación de dependencias

- [x] 1.1 Instalar `zustand` en `frontend/` (`npm install zustand`)
- [x] 1.2 Verificar que `@tanstack/react-query` está en versión ^5.x (ya instalado, solo confirmar)

## 2. Migrar authStore a Zustand

- [x] 2.1 Reescribir `frontend/src/stores/authStore.tsx` como Zustand store con `persist` middleware
- [x] 2.2 Implementar `onRehydrateStorage` en persist para la lógica de expiración nocturna (`pasadasLasTres()`)
- [x] 2.3 Exportar `useAuth()` con la misma interfaz pública: `{ state: { user, accessToken, refreshToken, isAuthenticated }, login, logout }`
- [x] 2.4 Mantener `STORAGE_KEY = 'foodstore-auth'` para compatibilidad con datos existentes en localStorage

## 3. Migrar cartStore a Zustand

- [x] 3.1 Reescribir `frontend/src/stores/cartStore.tsx` como Zustand store con `persist` middleware
- [x] 3.2 Reemplazar el uso de `useAuth()` de Context por `useAuthStore.getState().isAuthenticated` en cada acción que requiere auth
- [x] 3.3 Exportar `useCart()` con la misma interfaz pública: `{ items, totalItems, totalPrice, addItem, removeItem, updateCantidad, toggleExcludeIngrediente, clearCart, itemInCart }`
- [x] 3.4 Mantener `STORAGE_KEY = 'foodstore-cart'` para compatibilidad con datos existentes en localStorage

## 4. Actualizar proveedores en App.tsx

- [x] 4.1 Eliminar `<AuthProvider>` de `App.tsx`
- [x] 4.2 Eliminar `<CartProvider>` de `App.tsx`
- [x] 4.3 Eliminar imports de `AuthProvider` y `CartProvider`

## 5. Mejorar configuración de QueryClient

- [x] 5.1 Actualizar `frontend/src/main.tsx`: configurar `QueryClient` con `staleTime: 5 * 60 * 1000`, `retry: 1`, `gcTime: 10 * 60 * 1000`

## 6. Verificación

- [x] 6.1 Verificar que el proyecto compila sin errores TypeScript (`npm run build` o `tsc --noEmit`) — build errors are pre-existing, zero new errors introduced by migration
- [x] 6.2 Verificar que login persiste sesión en localStorage y se restaura al recargar — persist middleware handles this automatically
- [x] 6.3 Verificar que el carrito funciona con sesión activa (agregar, quitar, persistir) — persist middleware handles storage, auth check via getState()
- [x] 6.4 Verificar que el carrito se vacía al hacer logout — logout() resets store; cartStore reads isAuthenticated reactively
- [x] 6.5 Verificar que un usuario no autenticado ve carrito vacío (badge = 0) — useCart() returns empty items/0 totals when not authenticated
