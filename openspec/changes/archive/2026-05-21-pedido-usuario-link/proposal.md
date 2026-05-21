## Why

El modelo `Pedido` almacena `cliente_nombre` y `direccion_snapshot` como texto libre y no tiene FK a `Usuario` ni a `DireccionEntrega`. Esto impide saber qué usuario realizó cada pedido, mostrar el historial de pedidos de un cliente, y usar los catálogos `EstadoPedido` y `FormaPago` que ya existen en la base. Sin esta vinculación no es posible implementar el flujo completo de checkout ni el panel de administración de pedidos.

## What Changes

- `Pedido` agrega FK `usuario_id → usuarios.id` y `direccion_id → direcciones_entrega.id`
- `Pedido` agrega FK `forma_pago_codigo → formas_pago.codigo`
- `Pedido` reemplaza el campo libre `estado: str` por FK `estado_codigo → estados_pedido.codigo`
- `Pedido` mantiene `cliente_nombre_snapshot` y `direccion_snapshot` como campos de texto congelados (integridad histórica)
- `Usuario` expone relación inversa `pedidos: list[Pedido]`
- `pedido_service` recibe `usuario_id` + `direccion_id` al crear un pedido
- `PedidoCreate` schema actualizado con los nuevos campos obligatorios
- `pedidos_router` actualiza `POST /pedidos` para registrar usuario y dirección
- `UnitOfWork` no requiere cambios (pedidos ya están registrados)
- `HistorialEstadoPedido` ya existe — se vincula correctamente al flujo de cambio de estado

## Capabilities

### New Capabilities
- `order-user-relationship`: vincula `Pedido` a `Usuario`, `DireccionEntrega`, `EstadoPedido` y `FormaPago` mediante FKs; expone historial de pedidos por usuario

### Modified Capabilities

_(ninguna — delivery-address-management no cambia sus requisitos)_

## Impact

| Área | Impacto | Descripción |
|------|---------|-------------|
| `backend/models/pedido.py` | Modificado | Nuevas FKs + Relationships en `Pedido` y `Usuario` |
| `backend/models/usuario.py` | Modificado | Relación inversa `pedidos` |
| `backend/schemas/pedido.py` | Modificado | `PedidoCreate` con `usuario_id`, `direccion_id`, `forma_pago_codigo` |
| `backend/services/pedido_service.py` | Modificado | Lógica de creación con validación de usuario/dirección |
| `backend/repositories/pedido_repository.py` | Modificado | Filtro por `usuario_id` |
| `backend/routers/pedidos.py` | Modificado | Endpoint `POST /pedidos` y `GET /pedidos?usuario_id=` |
| `backend/models/__init__.py` | Modificado | Reexportar si se agregan clases nuevas |
