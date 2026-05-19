## 1. Separar shells de ruteo en App.tsx

- [ ] 1.1 Crear `PublicShell` — wrapper que renderiza `ClientLayout` sin check de auth
- [ ] 1.2 Renombrar `ClientShell` a `ProtectedClientShell` — mantiene el guard actual (redirect a `/login` si no autenticado)
- [ ] 1.3 Separar rutas públicas (`/`, `/conocenos`, `/envios`, `/descuentos`, `/productos`, `/productos/:id`) envueltas en `PublicShell`
- [ ] 1.4 Mantener rutas protegidas (`/carrito`, `/checkout`, `/pedidos`, `/pago/*`) envueltas en `ProtectedClientShell`

## 2. Avatar condicional en ClientLayout.tsx

- [ ] 2.1 Renderizar condicionalmente el avatar: si `state.isAuthenticated` → dropdown actual; si no → `<Link to="/login">` con ícono `User`
- [ ] 2.2 Eliminar `<ChevronDown>` del estado no autenticado (no hay dropdown que expandir)

## 3. Verificar integración

- [ ] 3.1 Verificar que la ruta catch-all (`*`) no mande a `/login` para usuarios no autenticados en rutas inválidas
- [ ] 3.2 Verificar que `ProductosPage` y `ProductoDetallePage` carguen datos sin auth (backend ya ok)
- [ ] 3.3 Verificar que `CartPage`, `CheckoutPage` y `PedidosPage` sigan redirigiendo a `/login` sin sesión
- [ ] 3.4 Verificar que `AdminShell` y rutas `/admin/*` no se hayan visto afectadas
- [ ] 3.5 Verificar que el login post-auth redirige correctamente según rol
- [ ] 3.6 Correr `tsc --noEmit` y verificar que no hay errores de tipo
