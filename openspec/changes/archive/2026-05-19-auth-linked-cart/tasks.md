## 1. Reordenar providers

- [ ] 1.1 Mover `CartProvider` de `main.tsx` adentro de `App.tsx`, envolviendo `AppRoutes` dentro de `AuthProvider`
- [ ] 1.2 Eliminar `CartProvider` de `main.tsx`

## 2. Vincular cartStore a authStore

- [ ] 2.1 Importar `useAuth` en `cartStore.tsx`
- [ ] 2.2 Llamar `useAuth()` dentro de `CartProvider` para acceder a `state.isAuthenticated`
- [ ] 2.3 Condicionar `items`, `totalItems`, `totalPrice` a `state.isAuthenticated`
- [ ] 2.4 Agregar guard en `addItem` que no haga nada si `!state.isAuthenticated`

## 3. Limpiar carrito al logout

- [ ] 3.1 Importar `clearCart` de `cartStore` y `useCart` en `ClientLayout.tsx`
- [ ] 3.2 En el onClick de "Cerrar sesión", agregar `clearCart()` antes de `navigate`

## 4. Bloquear add-to-cart sin sesión

- [ ] 4.1 En `ProductosPage.tsx`: importar `useAuth` y `useNavigate`, agregar guard en onClick de "Agregar al carrito"
- [ ] 4.2 En `ProductoDetallePage.tsx`: importar `useAuth` y `useNavigate`, agregar guard en `handleAddToCart` y `handleToggleExclude`
