## Context

`Pedido` almacena `cliente_nombre: str` y `direccion_snapshot: str` como texto libre sin FK. No existe referencia al usuario ni a la dirección estructurada. El servicio `pedido_service.create()` recibe `cliente_nombre` y `direccion` directamente del cliente (texto libre), lo que impide auditar "quién hizo qué pedido".

`direccion-entrega` ya implementó `DireccionEntrega` con `usuario_id → usuarios.id`. Los catálogos `EstadoPedido` y `FormaPago` ya existen en la base y están sembrados. El FSM de estados ya existe en `pedido_service.py` usando strings (sin FK a `estados_pedido`).

**Archivos actuales afectados:**
- `backend/models/pedido.py` — modelo `Pedido` sin FKs
- `backend/schemas/pedido.py` — `PedidoCreate` con campos libres
- `backend/services/pedido_service.py` — lógica de creación sin validación de usuario
- `backend/repositories/pedido_repository.py` — sin filtro por usuario
- `backend/routers/pedidos.py` — `GET /pedidos` sin filtro por `usuario_id`

## Goals / Non-Goals

**Goals:**
- Vincular `Pedido` a `Usuario` y `DireccionEntrega` mediante FKs (con valores nullable para no romper datos existentes)
- Vincular `Pedido` a `FormaPago` mediante FK
- Agregar FK blanda a `EstadoPedido` (el FSM sigue validando en servicio)
- Preservar snapshots históricos: `cliente_nombre` y `direccion_snapshot` se rellenan automáticamente desde el FK en la creación
- Exponer historial de pedidos por usuario via `GET /pedidos?usuario_id=`

**Non-Goals:**
- Migración de datos históricos (los pedidos existentes quedan con FKs en null)
- Autenticación JWT automática en `POST /pedidos` (es F2.x, fuera de alcance)
- Cambio del FSM de estados — continúa igual

## Decisions

### 1. FKs nullable en el modelo, required en el schema de creación

**Decisión**: `usuario_id`, `direccion_id` y `forma_pago_codigo` son `Optional` en el modelo SQLModel (nullable en DB) pero `int`/`str` obligatorios en `PedidoCreate`.

**Alternativa rechazada**: FK `NOT NULL` a nivel DB. Requeriría migration script para datos existentes o DROP/CREATE de la tabla, lo que rompe el flujo del integrador.

**Rationale**: Nullable permite avanzar sin migration destructiva. El schema de entrada garantiza que nuevos pedidos siempre tengan FK. Los pedidos históricos quedan con NULL intacto.

---

### 2. Snapshot de cliente y dirección se generan en el servicio (no los envía el cliente)

**Decisión**: `PedidoCreate` recibe `usuario_id` y `direccion_id`. El servicio carga `Usuario.nombre` → `cliente_nombre` y formatea `DireccionEntrega` → `direccion_snapshot`. El cliente nunca envía texto libre.

**Alternativa rechazada**: Mantener texto libre (`cliente_nombre`, `direccion`) en `PedidoCreate`. Permitiría inconsistencias (nombre distinto al del usuario real).

**Rationale**: Snapshot garantiza integridad histórica sin depender de que el cliente envíe datos coherentes. Si el usuario cambia su nombre, el pedido original no se altera.

---

### 3. FK a `EstadoPedido` como string de referencia — sin cambiar el campo

**Decisión**: Agregar `estado_codigo: Optional[str] = Field(foreign_key="estados_pedido.codigo")` renombrando el campo existente `estado` → `estado_codigo`. El FSM del servicio ya valida transiciones; la FK añade integridad a nivel DB.

**Alternativa rechazada**: Mantener el campo `estado: str` sin FK. Pierdes la integridad referencial y `estados_pedido` quedaría como catálogo sin usar.

**Rationale**: El campo se renombra a `estado_codigo` para dejar claro que es una FK a un catálogo, alineando con la nomenclatura de `FormaPago.codigo` y `Rol.codigo`.

---

### 4. Relación inversa `Usuario.pedidos` — lazy load

**Decisión**: Agregar `pedidos: list["Pedido"] = Relationship(back_populates="usuario")` en `Usuario`. No se carga automáticamente en los endpoints de usuario (requeriría `selectinload` explícito).

**Rationale**: Permite acceder a `usuario.pedidos` cuando sea necesario sin cargar la relación en cada GET de usuario.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| Migración de tabla `pedidos` con columnas nuevas nullable | Alembic autogenera el ADD COLUMN — baja fricción |
| FSM usa strings (`"PENDIENTE"`, `"EN_PREPARACIÓN"`) que deben coincidir con `estados_pedido.codigo` | El seed de `auth_service` ya incluye estos códigos; validar en seed test |
| `transicionar_estado` tiene un bug: captura `pedido.estado` DESPUÉS de asignarlo | **Corregir en este change**: capturar el estado anterior antes de mutar `pedido.estado` |
| `DireccionEntrega` puede no estar implementada si `direccion-entrega` no fue aplicado | Prerequisito declarado en el roadmap; no agregar guard code aquí |

## Migration Plan

1. Ejecutar Alembic autogenerate para las nuevas columnas en `pedidos`
2. Las columnas son nullable — no requiere backfill
3. El seed de estados ya corre en startup via `auth_service` — no hay pasos manuales adicionales
4. Rollback: DROP COLUMN de las nuevas FKs (datos históricos no se ven afectados)

## Open Questions

_(ninguna — scope bien definido)_
