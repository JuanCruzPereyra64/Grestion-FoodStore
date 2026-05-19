## Context

Hoy toda ruta de cliente (`, /conocenos, /envios, /descuentos, /productos, /productos/:id, /carrito, /checkout, /pedidos, /pago/*`) está envuelta en `ClientShell`, que exige `state.isAuthenticated` y redirige a `/login` si no lo está. Un visitante anónimo no ve nada del sitio.

El backend ya expone `GET /productos/`, `GET /productos/{id}`, `GET /categorias/` sin autenticación. El carrito (`cartStore`) es 100% client-side con localStorage, sin dependencia de auth. El API service (`api.ts`) ya tolera la ausencia de token — `getAuthHeaders()` devuelve `{}` si no hay nada en localStorage.

## Goals / Non-Goals

**Goals:**
- Separar rutas públicas de protegidas en el routing
- Landing page ( / ), contenido informativo (conocenos, envios, descuentos) y catálogo (productos, productos/:id) accesibles sin autenticación
- Avatar en navbar condicional: no-auth → link a /login; auth → dropdown actual
- Carrito, checkout, pagos y admin se mantienen protegidos
- Login page ( /login ) se mantiene standalone

**Non-Goals:**
- No se toca el backend — endpoints públicos ya funcionan sin auth
- No se agrega registro de usuarios, forgot password, ni auth social
- No se cambia la lógica de auth ni el store
- No se agregan guards por rol en rutas públicas

## Decisions

### DEC-001: PublicShell wrapper (nuevo) + ProtectedClientShell (renombrado)

**Decisión:** Crear `PublicShell` que renderiza `ClientLayout` sin check de auth. Renombrar `ClientShell` a `ProtectedClientShell` (o `AuthClientShell`) para envolver solo rutas que requieren sesión.

**Razón:** El `ClientLayout` ya usa `useAuth()` y no crashea cuando `isAuthenticated = false` — solo necesita un cambio condicional en el avatar. Separar shells mantiene el código explícito: si una ruta usa `PublicShell` es pública, si usa `ProtectedClientShell` es protegida.

**Alternativa considerada:** Pasar un prop `public` a `ClientShell` y condicionar el redirect. Descartado porque mezcla responsabilidades y el guard de auth es una preocupación transversal que debe ser explícita en las rutas.

### DEC-002: Avatar condicional en ClientLayout

**Decisión:** En `ClientLayout.tsx`, el bloque del avatar (col 1 del navbar) pasa a ser:

```
if !state.isAuthenticated →
  <Link to="/login">
    <User icon />
  </Link>

if state.isAuthenticated →
  <button onClick={dropdown}> + dropdown actual
```

**Razón:** El icono `User` es el punto de entrada natural al login. Para usuarios autenticados no cambia nada.

**Alternativa considerada:** Dejar el dropdown siempre visible pero con opciones diferentes. Descartado porque un dropdown con solo "Iniciar sesión" es confuso — mejor un link directo.

### DEC-003: Ruta /login redirect post-auth se mantiene

**Decisión:** Cuando un usuario autenticado visita `/login`, se sigue redirigiendo a su `defaultPath` ( `/` para clientes, `/admin` para admins).

**Razón:** Ya funciona correctamente y no hay razón para cambiarlo. Al hacer `/` pública, un cliente autenticado que va a `/login` va a `/` (pública) pero con el navbar en modo autenticado. Correcto.

### DEC-004: No se tocan las rutas de admin

**Decisión:** `AdminShell` y todas las rutas `/admin/*` se mantienen exactamente igual.

**Razón:** El admin ya está correctamente aislado. Cambiarlo está fuera del alcance.

## Cambios en el código

### App.tsx

```tsx
// Nuevo wrapper público — solo renderiza ClientLayout
function PublicShell({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}

// ClientShell renombrado para ser explícito
function ProtectedClientShell({ children }: { children: ReactNode }) {
  const { state } = useAuth()
  if (!state.isAuthenticated) return <Navigate to="/login" replace />
  if (!state.user?.roles?.includes('CLIENT')) return <Navigate to="/admin" replace />
  return <ClientLayout>{children}</ClientLayout>
}

// En las rutas:
{/* Públicas — sin auth */}
<Route path="/" element={<PublicShell><ClientHomePage /></PublicShell>} />
<Route path="/conocenos" element={<PublicShell><ConocenosPage /></PublicShell>} />
<Route path="/descuentos" element={<PublicShell><DescuentosPage /></PublicShell>} />
<Route path="/envios" element={<PublicShell><EnviosPage /></PublicShell>} />
<Route path="/productos" element={<PublicShell><ProductosPage /></PublicShell>} />
<Route path="/productos/:id" element={<PublicShell><ProductoDetallePage /></PublicShell>} />

{/* Protegidas cliente — requieren auth */}
<Route path="/carrito" element={<ProtectedClientShell><CartPage /></ProtectedClientShell>} />
<Route path="/checkout" element={<ProtectedClientShell><CheckoutPage /></ProtectedClientShell>} />
<Route path="/pedidos" element={<ProtectedClientShell><PedidosPage /></ProtectedClientShell>} />
<Route path="/pago/success" element={<ProtectedClientShell><PagoResultPage /></ProtectedClientShell>} />
<Route path="/pago/failure" element={<ProtectedClientShell><PagoResultPage /></ProtectedClientShell>} />
<Route path="/pago/pending" element={<ProtectedClientShell><PagoResultPage /></ProtectedClientShell>} />
```

### ClientLayout.tsx — Avatar condicional

```tsx
// Col 1: Avatar
<div className="justify-self-start">
  {state.isAuthenticated ? (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setDropdownOpen(!dropdownOpen)} /* ... */>
        <User /> <ChevronDown />
      </button>
      {dropdownOpen && (/* dropdown actual */)}
    </div>
  ) : (
    <Link
      to="/login"
      className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <User size={16} />
      </div>
    </Link>
  )}
</div>
```

### Sin cambios

| Archivo | Razón |
|---------|-------|
| `backend/*` | Endpoints públicos ya sin auth |
| `frontend/src/services/api.ts` | `getAuthHeaders()` tolera falta de token |
| `frontend/src/stores/authStore.tsx` | Lógica de auth no cambia |
| `frontend/src/stores/cartStore.tsx` | Funciona sin auth |
| `frontend/src/pages/LoginPage.tsx` | Ya standalone |
| `frontend/src/components/layout/AdminShell` | No se toca |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Usuario anónimo acumula carrito y al hacer login pierde items | El carrito ya persiste en localStorage entre sesiones. Si hay merge de carrito anónimo → autenticado en el futuro, será otro change. Por ahora, el carrito sobrevive al login. |
| Rutas públicas exponen info de productos que antes requería login | Es el objetivo del cambio — mostrar el catálogo. No hay datos sensibles. |
| Alguien spamea GET /productos/ sin rate limit | Es un riesgo existente, no nuevo. Fuera del alcance. |
| `ProductoDetallePage` tiene botón "Agregar al carrito" que funciona sin auth | El cartStore es client-side y funciona. Si checkout requiere auth, redirige a login. Es un flow natural. |
