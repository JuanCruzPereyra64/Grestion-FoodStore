# Mapa de Changes — Food Store v5.0
**Actualizado**: 2026-05-22 (alembic-setup archivado — mercadopago-sdk-frontend como próximo)  
**Metodología**: OPSX (Spec-Driven Development)  
**Referencia**: `docs/integrador.txt` v5.0

---

## Leyenda

| Símbolo | Significado |
|---|---|
| ✅ | Artefacto existe |
| ❌ | Falta crear |
| 🆕 | Change nuevo — proponer con `/opsx:propose` |
| 🔄 | Change activo — continuar con `/opsx:apply` |
| ⚗️ | Change incompleto — necesita artefactos previos |
| 🏁 | Listo para apply |

---

## FASE 0 — Fundaciones UoW y Prefijo (desbloquean todo lo demás)

> Sin esta fase, cualquier change posterior va a pisarse con los patrones incorrectos.

| # | Change | Estado | Acción |
|---|---|---|---|
| F0.1 | `core-uow-roles` | ✅ Archivado | — |
| F0.2 | `api-v1-prefix` | ✅ Archivado | — |

**`api-v1-prefix`** — qué hace:
- Agrega prefijo `/api/v1` a todos los routers (`auth`, `productos`, `categorias`, `ingredientes`, `pedidos`, `pagos`, `reportes`)
- Actualiza la `BASE_URL` y todas las llamadas en `frontend/src/services/api.ts`

---

## FASE 1 — Modelo de datos completo y RBAC

> Depende de FASE 0 completa.

| # | Change | Estado | Acción |
|---|---|---|---|
| F1.1 | `direccion-entrega` | ✅ Archivado | — |
| F1.2 | `pedido-usuario-link` | ✅ Archivado | — |
| F1.3 | `security-rbac-complete` | ✅ Archivado | — |

**`direccion-entrega`** — qué hizo:
- Modelo `DireccionEntrega` (alias, linea1, ciudad, cp, es_principal, usuario_id FK)
- CRUD completo: `POST /api/v1/direcciones`, `GET`, `PUT /{id}`, `DELETE /{id}`, `PATCH /{id}/principal`
- Seed data: tablas `EstadoPedido` y `FormaPago` con sus registros catálogo
- Dependency: FASE 0 completa (UoW correcto)

**`pedido-usuario-link`** — qué hizo:
- FK `usuario_id → usuarios`, `direccion_id → direcciones_entrega`, `forma_pago_codigo → formas_pago` en `Pedido` (nullable, sin migration destructiva)
- Campo `estado` renombrado a `estado_codigo` con FK → `estados_pedido.codigo`
- `PedidoCreate` ya no acepta texto libre — recibe IDs; el servicio construye snapshots automáticamente
- Relación inversa `Usuario.pedidos`
- `GET /api/v1/pedidos?usuario_id=` para filtrar por usuario
- Fix bug `transicionar_estado`: capturaba el estado posterior en vez del anterior
- Fix seed: alineó `estados_pedido` con el FSM (agregó `EN_CAMINO` y `FACTURADO`, quitó acento de `EN_PREPARACIÓN`)
- Dependency: `direccion-entrega`

**`security-rbac-complete`** — qué hizo:
- `slowapi` en `main.py`: rate limiting 5 intentos/15min por IP en `POST /api/v1/auth/login` (429 al exceder)
- `require_role` aplicado en todos los routers:
  - `productos`, `categorias`, `ingredientes`: escritura requiere `ADMIN` o `STOCK`; GET públicos
  - `pedidos`: `POST` requiere `CLIENT`; `PATCH /{id}/estado` requiere `PEDIDOS` o `ADMIN`; `DELETE /{id}` requiere `CLIENT` o `ADMIN`; `POST /{id}/factura` requiere `PEDIDOS` o `ADMIN`
  - `reportes`: todo requiere `ADMIN`
- Nuevas rutas `PATCH /pedidos/{id}/estado` y `DELETE /pedidos/{id}` (cancelación vía FSM)
- CORS movido a variable de entorno `CORS_ORIGINS`
- Dependency: FASE 0 completa

---

## FASE 2 — Frontend: arquitectura de estado

> Depende de FASE 1 completa (schemas backend corregidos antes de migrar frontend).

| # | Change | Estado | Acción |
|---|---|---|---|
| F2.1 | `zustand-tanstack-migration` | ✅ Archivado | — |

**`zustand-tanstack-migration`** — qué hizo:
- Instaló `zustand` con middleware `persist` y `createJSONStorage`
- Migró `authStore` de Context+useReducer → Zustand store con persist (key `foodstore-auth`); lógica de expiración nocturna `pasadasLasTres()` en `onRehydrateStorage`
- Migró `cartStore` de Context+useReducer → Zustand store con persist (key `foodstore-cart`); acciones verifican auth vía `useAuthStore.getState()` (imperativo) y `useAuthStore(selector)` (reactivo)
- Eliminó `<AuthProvider>` y `<CartProvider>` de `App.tsx` — no más Provider nesting
- Configuró `QueryClient` con defaults de producción: `staleTime: 5min`, `retry: 1`, `gcTime: 10min`
- API pública de `useAuth()` y `useCart()` idéntica — cero cambios en páginas ni componentes

---

## FASE 3 — Features completadas

> Todos archivados.

| # | Change | Estado |
|---|---|---|
| F3.1 | `fix-api-contract` | ✅ Archivado |
| F3.2 | `product-ingredients-integration` | ✅ Archivado |
| F3.3 | `dashboard-creation` | ✅ Archivado |
| F3.4 | `client-product-card-fix` | ✅ Archivado |
| F3.5 | `product-card-layout-optimization` | ✅ Archivado |
| F3.6 | `invoice-generation-pdf` | ✅ Archivado |
| F3.7 | `admin-reports-excel` | ✅ Archivado |

---

## FASE 4 — Polish y extras

> Sin dependencias duras. Se pueden hacer en cualquier momento.

| # | Change | Estado | Acción |
|---|---|---|---|
| F4.1 | `frontend-redesign` | ✅ Archivado | — |
| F4.2 | `alembic-setup` | ✅ Archivado | — |
| F4.3 | `mercadopago-checkout-pro` | ✅ Funcionando | Agregar `MERCADOPAGO_ACCESS_TOKEN` en `.env` |

---

## Resumen de dependencias (DAG)

```
F0.1 core-uow-roles ✅ ─────┐
F0.2 api-v1-prefix ✅ ───────┼──► F1.1 direccion-entrega ✅
                              │         │
                              │         ▼
                              │    F1.2 pedido-usuario-link ✅
                              │         │
                              ├──► F1.3 security-rbac-complete ✅
                              │         │
                              └─────────┼──► F2.1 zustand-tanstack-migration ✅
                                        │         │
                                        │         ▼
                                        │    F3.x ✅ (todos archivados)
                                        │
                                        └────► F4.x (polish)
```

---

## Próximos cambios a proponer (en orden)

> FASE 2 completa. Ver FASE 4 para los bonus pendientes.

---

## Changes archivados

| Change | Fecha | Descripción |
|---|---|---|
| `zustand-tanstack-migration` | 2026-05-21 | authStore + cartStore migrados a Zustand persist; Providers eliminados; QueryClient con defaults de producción |
| `security-rbac-complete` | 2026-05-21 | RBAC completo en todos los routers + rate limiting login + CORS desde env |
| `pedido-usuario-link` | 2026-05-21 | FKs usuario/dirección/forma_pago en Pedido + filtro por usuario + fix FSM |
| `direccion-entrega` | 2026-05-21 | Modelo DireccionEntrega + CRUD + catálogos EstadoPedido y FormaPago |
| `api-v1-prefix` | 2026-05-21 | Prefijo `/api/v1` en todos los routers + `BASE_URL` actualizada en frontend |
| `core-uow-roles` | 2026-05-21 | UoW auto-commit + Rol con PK semántica `codigo` |
| `admin-reports-excel` | 2026-05-20 | Reportes administrativos con gráficos y descarga de CSV |
| `invoice-generation-pdf` | 2026-05-20 | Generación y descarga de facturas en PDF con ReportLab |
| `product-ingredients-integration` | 2026-05-20 | Relación ingredientes en producto N:M e interfaz de edición |
| `dashboard-creation` | 2026-05-20 | Dashboard principal y métricas |
| `frontend-redesign` | 2026-05-20 | Rediseño premium de UI (Framer Motion, Glassmorphism, Tailwind 4) |
| `fix-api-contract` | 2026-05-20 | Alineación de tipos y contratos de API frontend-backend |
| `client-product-card-fix` | 2026-05-20 | Detalle de producto e ingredientes optimizado para clientes |
| `product-card-layout-optimization` | 2026-05-20 | Layout simplificado y controles de compra unificados |
| `auth-linked-cart` | 2026-05-19 | Carrito vinculado al estado de auth |
| `menu-card-readability-hotfix` | 2026-05-19 | Legibilidad en tarjetas del menú |
| `public-landing-auth-flow` | 2026-05-19 | Flow de login y landing público |
| `about-us-page` | 2026-05-14 | Página "Conócenos" |
| `discounts-page` | 2026-05-14 | Página de descuentos |
| `shipping-info-page` | 2026-05-14 | Página informativa de envíos |
| `cart-and-checkout-flow` | 2026-05-14 | Flujo carrito + checkout inicial |
| `navbar-routing-layout-fix` | 2026-05-14 | Fix ruteo Navbar |
| `critical-navbar-routing-fix` | 2026-05-14 | Hotfix enrutamiento principal |
| `force-absolute-routing` | 2026-05-14 | Normalización rutas absolutas |
| `immersive-hero-blur-overlay` | 2026-05-14 | Overlay blur hero |
| `hero-glass-card` / `force-hero-glass-card` | 2026-05-14 | Glassmorphism landing |
| `logo-home-link` | 2026-05-14 | Logo → home |
| `blur-gradient-mask` | 2026-05-14 | Efecto degradado |
| `fix-product-ingredient-relation` | 2026-04-17 | Relación N:M ingredientes-productos |
