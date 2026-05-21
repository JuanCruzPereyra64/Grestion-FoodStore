## Why

El modelo `Pedido` usa `cliente_nombre: str` y `direccion_snapshot: str` como texto libre — no hay entidad de dirección estructurada ni catálogos de estados y formas de pago. Esto impide vincular pedidos a usuarios reales y calcular totales según forma de pago. `direccion-entrega` crea el modelo `DireccionEntrega` con CRUD completo y siembra los catálogos `EstadoPedido` y `FormaPago` que desbloquean `pedido-usuario-link`.

## What Changes

- Nuevo modelo `DireccionEntrega` (alias, linea1, ciudad, cp, es_principal, usuario_id FK → usuarios)
- Schema `DireccionCreate`, `DireccionUpdate`, `DireccionRead`
- Repositorio `DireccionRepository` con métodos CRUD + `set_principal`
- Servicio `direccion_service` con lógica de negocio (una sola dirección principal por usuario)
- Router `/direcciones` con 5 endpoints: `POST /`, `GET /`, `GET /{id}`, `PUT /{id}`, `DELETE /{id}`, `PATCH /{id}/principal`
- Registro del router en `main.py` con `prefix="/api/v1"`
- `DireccionEntrega` agregado al `UnitOfWork`
- Seed: tabla `EstadoPedido` (PENDIENTE, CONFIRMADO, EN_PREPARACION, LISTO, ENTREGADO, CANCELADO)
- Seed: tabla `FormaPago` (EFECTIVO, MERCADOPAGO)

## Capabilities

### New Capabilities
- `delivery-address-management`: CRUD de direcciones de entrega por usuario con soporte de dirección principal

### Modified Capabilities

_(ninguna)_

## Impact

| Área | Impacto | Descripción |
|------|---------|-------------|
| `backend/models/` | Nuevo | `DireccionEntrega`, `EstadoPedido`, `FormaPago` |
| `backend/schemas/` | Nuevo | `direccion.py` |
| `backend/repositories/` | Nuevo | `DireccionRepository` |
| `backend/services/` | Nuevo | `direccion_service.py` |
| `backend/routers/` | Nuevo | `direcciones.py` |
| `backend/uow/unit_of_work.py` | Modificado | Agrega `direcciones: DireccionRepository` |
| `backend/services/auth_service.py` | Modificado | Seed de `EstadoPedido` y `FormaPago` |
| `backend/main.py` | Modificado | `include_router(direcciones.router, prefix="/api/v1")` |
| `backend/models/__init__.py` | Modificado | Exportar nuevos modelos |
