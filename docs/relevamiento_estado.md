# Relevamiento del Estado del Proyecto — FoodStore
**Fecha**: 2026-05-20  
**Spec de referencia**: `docs/integrador.txt` (v5.0) + `docs/Descripcion.txt` + `docs/Historias de Usuario.txt`

---

## Resumen ejecutivo

El proyecto tiene una base funcional que cubre el flujo básico (auth → productos → carrito → pedidos → pagos). Sin embargo, presenta desvíos importantes respecto a la spec v5.0 que impactan directamente la rúbrica de 200 puntos. El backend funciona end-to-end pero tiene patrones incorrectos y módulos faltantes. El frontend tiene las páginas construidas pero usa React Context en vez de Zustand y fetch nativo en vez de Axios.

**Estimado de nota actual**: ~90–100/200 pts

---

## BACKEND

### ✅ Implementado y funcional

| Componente | Archivo(s) | Notas |
|---|---|---|
| Modelos SQLModel | `backend/models/*.py` | Usuario, Rol, UsuarioRol, RefreshToken, Categoria, Producto, Ingrediente, ProductoIngrediente, Pedido, PedidoDetalle, HistorialEstadoPedido, Pago, Factura |
| Auth JWT (login/register/refresh/logout) | `routers/auth.py`, `services/auth_service.py` | Access 30min + Refresh 7d, bcrypt |
| Rotación de refresh tokens | `auth_service.py:130` | Revocación en logout, revocado_en timestamp |
| FSM de pedidos | `services/pedido_service.py:19-27` | `TRANSICIONES_FSM` dict con estados válidos |
| Snapshots en DetallePedido | `models/pedido.py:42-43` | `precio_unitario_snapshot`, `producto_nombre_snapshot` |
| Soft delete en Usuario | `models/usuario.py:25` | `eliminado_en` nullable |
| Seed data idempotente | `services/auth_service.py:178` | Roles + 2 usuarios por defecto |
| `get_current_user` dependency | `dependencies/auth.py:54` | Decodifica JWT, valida usuario |
| `require_role` dependency | `dependencies/auth.py:69` | Factory de dependencia con lista de roles |
| Unit of Work (básico) | `uow/unit_of_work.py` | Context manager con rollback en error |
| Repositories (7) | `repositories/*.py` | categoria, factura, ingrediente, pedido, producto, refresh_token, usuario |
| Módulo Factura (PDF) | `services/factura_service.py`, `routers/pedidos.py` | **Extra** — genera PDF descargable, no está en spec |
| Módulo Reportes | `routers/reportes.py`, `services/reporte_service.py` | **Extra** — estadísticas + CSV |
| MercadoPago backend | `services/mercadopago_service.py`, `routers/pagos.py` | Preferencias + webhook IPN |

---

### ❌ Gaps críticos

#### 1. Sin prefijo `/api/v1` en rutas
- **Actual**: `/auth/login`, `/pedidos/`, `/productos/`
- **Spec**: `/api/v1/auth/login`, `/api/v1/pedidos/`, `/api/v1/productos/`
- **Impacto**: El evaluador probará contra `/api/v1/…`

#### 2. Rate limiting no configurado
- `slowapi` en `requirements.txt` pero **no está en `main.py`**
- La spec exige: máx 5 intentos login por IP en 15 min → HTTP 429 con header `Retry-After`
- **Impacto**: criterio "Backend — Estructura y Configuración"

#### 3. Módulo `DireccionEntrega` completamente ausente
- No existe modelo, router, servicio ni repositorio
- La spec exige CRUD completo + `PATCH /{id}/principal`
- Consecuencia: `PedidoCreate` usa `direccion` (texto libre) en vez de `direccion_id` FK
- **Impacto**: afecta modelo de datos, checkout y flujo de pedidos

#### 4. `Pedido` sin FK a `usuario_id`
- **Actual**: `Pedido` tiene `cliente_nombre: str` (texto libre) sin FK
- **Spec**: `usuario_id: int FK → usuarios`, el nombre se toma del JWT
- **Consecuencia**: los clientes no tienen historial propio; `GET /pedidos` no filtra por usuario

#### 5. `EstadoPedido` y `FormaPago` no son tablas catálogo
- **Actual**: `estado` es `str` hardcoded en `Pedido`
- **Spec**: tabla `EstadoPedido` con campo `es_terminal`; tabla `FormaPago` con `MERCADOPAGO`, `EFECTIVO`, `TRANSFERENCIA`; ambas con seed data

#### 6. UoW no auto-commitea al salir exitosamente
- **Actual**: `__exit__` hace rollback si error, pero **no hace commit si no hay error**
- Todos los servicios llaman `uow.commit()` manualmente (anti-patrón según spec)
- **Spec**: el UoW hace `commit()` automático en `__exit__` cuando no hay excepción; los servicios no deben commitear

#### 7. Sin Alembic
- **Actual**: `create_db_and_tables()` de SQLModel en el `lifespan` de main.py
- **Spec**: `alembic upgrade head` debe crear todas las tablas
- **Impacto**: checklist CE-04

#### 8. CORS hardcoded
- `allow_origins=["http://localhost:5173"]` hardcodeado en `main.py`
- **Spec**: debe leer de variable de entorno `CORS_ORIGINS`

#### 9. Sin RFC 7807 (Problem Details)
- Los errores son `{"detail": "mensaje"}` (default FastAPI)
- **Spec**: `{"type": …, "title": …, "status": …, "detail": …, "instance": …}`

#### 10. Estructura plana (no feature-first)
- **Actual**: `/backend/routers/`, `/backend/services/`, `/backend/models/` — organización por tipo
- **Spec**: `/backend/modules/auth/`, `/backend/modules/pedidos/` — organización por feature
- Cada módulo debería tener `model.py`, `schemas.py`, `repository.py`, `service.py`, `router.py`

#### 11. Endpoints sin RBAC
- `routers/pedidos.py` — sin `require_role` ni `get_current_user`
- `routers/productos.py` — a verificar; endpoints de escritura deberían requerir ADMIN/STOCK
- **Consecuencia**: cualquier usuario anónimo puede crear/leer pedidos

#### 12. `HistorialEstadoPedido` sin `usuario_id`
- No registra quién ejecutó la transición
- **Spec**: campo `usuario_id` nullable (NULL = Sistema automático)

---

### ⚠️ Bugs encontrados

| Bug | Archivo | Línea | Descripción |
|---|---|---|---|
| `estado_desde` guarda estado incorrecto | `pedido_service.py` | 44 | Se asigna `pedido.estado` DESPUÉS de cambiarlo → guarda el estado nuevo, no el anterior |
| Stock se decrementa al CREAR, no al CONFIRMAR | `pedido_service.py` | 82-94 | Spec RN-FS03: decremento debe ocurrir en la transición PENDIENTE→CONFIRMADO |
| `create` llama `uow.commit()` directamente | `pedido_service.py` | 112 | Viola el patrón UoW (el commit debe ser responsabilidad del UoW) |
| HistorialEstadoPedido no registra estado inicial | `pedido_service.py` | — | Al crear el pedido, no se inserta el registro inicial con `estado_desde=NULL` |

---

## FRONTEND

### ✅ Implementado y funcional

| Componente | Archivo(s) | Notas |
|---|---|---|
| Routing con guards por rol | `App.tsx` | AdminShell / PublicShell / ProtectedClientShell |
| 14 páginas | `pages/*.tsx` | Login, AdminDashboard, AdminProductos, Ingredientes, ClientHome, Conocenos, Descuentos, Envios, Productos, ProductoDetalle, Cart, Checkout, PagoResult, Pedidos |
| Layouts | `components/layout/` | MainLayout (admin sidebar) + ClientLayout (navbar) |
| Cart con persistencia localStorage | `stores/cartStore.tsx` | Vinculado a auth (vacío si no está logueado) |
| Custom hooks (6) | `hooks/*.ts` | useCategorias, useIngredientes, usePagos, usePedidos, useProductos, useReportes |
| Tipos TypeScript | `types/index.ts` | Bien tipado |
| Tailwind CSS | Todas las páginas | Usado consistentemente |

---

### ❌ Gaps críticos

#### 1. Sin Zustand — usa React Context + useReducer
- **Actual**: `authStore.tsx` y `cartStore.tsx` son React Context con `useReducer`
- **Spec**: 4 stores Zustand 4.x con middleware `persist` y suscripción por slice
- **Zustand no está instalado** en `package.json`
- **Falta**: `paymentStore` y `uiStore` directamente no existen
- **Impacto**: 10 pts de rúbrica "Frontend — Zustand"

#### 2. Sin Axios — usa `fetch` nativo
- **Actual**: `services/api.ts` usa `fetch()` con `getAuthHeaders()` manual
- **Spec**: instancia Axios centralizada con interceptores de request y response
- Sin refresh automático en 401 → el usuario pierde sesión silenciosamente
- **Impacto**: 15 pts de rúbrica "Frontend — TanStack Query"

#### 3. Sin TanStack Query
- **Actual**: hooks usan `useState` + `useEffect` + `fetch` directo
- **Spec**: `useQuery`/`useMutation` con `queryKeys`, `invalidateQueries` tras mutaciones, `staleTime`, retry
- **Impacto**: 15 pts de rúbrica "Frontend — TanStack Query"

#### 4. Sin TanStack Form
- Formularios con estado manual (`useState` por campo)
- **Spec**: TanStack Form con validación declarativa y tipado end-to-end

#### 5. Sin MercadoPago SDK (`@mercadopago/sdk-react`)
- `CheckoutPage` redirige al `init_point` (externa a la app)
- **Spec**: integración con `CardPayment` de `@mercadopago/sdk-react` para tokenización PCI SAQ-A dentro de la app

#### 6. `PedidoCreate` schema incorrecto
- **Actual**: `{ cliente_nombre: string, direccion: string, items }`
- **Spec**: `{ items, forma_pago_codigo: string, direccion_id: number | null }`
- Directamente vinculado al gap de DireccionEntrega en backend

#### 7. Sin interceptor de refresh automático en 401
- Si el access token expira, la petición falla con 401 y el usuario queda sin sesión
- **Spec**: interceptor Axios que detecta 401 → llama refresh → reintenta la petición original de forma transparente

---

### ⚠️ Comportamientos no deseados

| Issue | Archivo | Descripción |
|---|---|---|
| Sesión expira a las 3am | `authStore.tsx:18-33` | `pasadasLasTres()` fuerza logout si la hora >= 3am en Argentina. No está en la spec |
| API sin prefijo `/api/v1` | `services/api.ts:1` | Base URL es `http://localhost:8000` — consistente con backend pero incorrecto vs spec |

---

## OPENSPEC — Cambios activos pendientes

| Change | Estado | Prioridad |
|---|---|---|
| `core-uow-roles` | Propuesto | **CRÍTICA** — base de refactor v5 (PK semántica roles + UoW auto-commit) |
| `fix-api-contract` | Activo | **CRÍTICA** — corrige schema PedidoCreate + agrega usuario_id en Pedido |
| `dashboard-creation` | Activo | Alta — panel admin con recharts |
| `frontend-redesign` | Activo | Alta — migración a FSD + Zustand |
| `product-ingredients-integration` | Activo | Alta |
| `product-card-layout-optimization` | Activo | Media |
| `client-product-card-fix` | Activo | Media |
| `invoice-generation-pdf` | Activo | Media — parcialmente implementado |
| `admin-reports-excel` | Activo | Media — CSV ya existe |
| `product-card-image-maximization` | Activo | Baja |

---

## Mapa de puntos en riesgo (rúbrica 200pts)

| Criterio | Pts totales | Estado actual | Estimado obtenible |
|---|---|---|---|
| Backend — Estructura y Configuración | 10 | Sin /api/v1, sin rate limiting, estructura plana | ~4 |
| Backend — Modelo de Datos | 15 | Falta DireccionEntrega, EstadoPedido/FormaPago catálogo, sin Alembic | ~7 |
| Backend — Unit of Work y Repository | 15 | UoW con rollback ✅, sin auto-commit ❌, services hacen commit manual | ~9 |
| Backend — Capa de Servicio | 15 | FSM ✅, bug estado_desde ❌, sin RBAC en pedidos ❌ | ~8 |
| Backend — Controladores REST | 15 | Sin /api/v1, sin RFC 7807, RBAC incompleto | ~7 |
| Backend — MercadoPago | 15 | Backend ok ✅, frontend sin SDK ❌ | ~9 |
| Frontend — Estructura y TypeScript | 10 | No es FSD, bien tipado | ~5 |
| Frontend — Zustand | 10 | **NO implementado** (Context/useReducer) | ~1 |
| Frontend — TanStack Query | 15 | **NO implementado** (fetch + useEffect) | ~3 |
| Frontend — Funcionalidades Cliente | 15 | Catálogo + carrito + checkout básico OK | ~10 |
| Frontend — Panel Admin | 15 | CRUD básico ✅, falta dashboard con recharts | ~8 |
| UI/UX y Diseño | 10 | Tailwind consistente, diseño cuidado | ~7 |
| Calidad de Código | 10 | Convenciones OK, README existe | ~6 |
| **TOTAL estimado** | **165** | | **~84** |

---

## Prioridades sugeridas para subir la nota

### 🔴 Prioridad ALTA (más impacto en puntos)
1. **Migrar authStore y cartStore a Zustand** (+10 pts directo)
2. **Agregar Axios con interceptores JWT + refresh en 401** (habilita TanStack Query)
3. **Implementar TanStack Query** en los hooks existentes (+15 pts)
4. **Corregir `PedidoCreate`** para usar `usuario_id` del JWT + `direccion_id` FK
5. **Agregar prefijo `/api/v1`** en todos los routers
6. **Agregar módulo DireccionEntrega** (modelo + CRUD + `es_principal`)

### 🟡 Prioridad MEDIA
7. Configurar `slowapi` rate limiting en `main.py`
8. Crear tablas catálogo `EstadoPedido` y `FormaPago` con seed data
9. Corregir bug `estado_desde` en `transicionar_estado` (`pedido_service.py:44`)
10. Agregar `usuario_id` a modelo `Pedido`
11. Agregar `require_role` en `pedidos.py` y demás routers
12. Auto-commit en `UoW.__exit__`
13. Insertar registro inicial en `HistorialEstadoPedido` al crear pedido
14. Mover decremento de stock a transición CONFIRMADO (no en creación)

### 🟢 Prioridad BAJA (calidad y completitud)
15. Configurar Alembic con migraciones versionadas
16. Mover CORS a variable de entorno `CORS_ORIGINS`
17. RFC 7807 en manejo de errores
18. Reestructurar backend a feature-first
19. Integrar `@mercadopago/sdk-react` en `CheckoutPage`
20. Eliminar lógica `pasadasLasTres()` del `authStore`
21. Agregar `paymentStore` y `uiStore` en Zustand
