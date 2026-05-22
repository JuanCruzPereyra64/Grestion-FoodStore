## Why

El flujo de compra tiene dos problemas críticos: bugs en la integración con MercadoPago que causan un error 500 silencioso, y un checkout que obliga al usuario a reingresar datos (nombre, teléfono, dirección) que ya existen en la base de datos. Esto frena la conversión y genera una experiencia de usuario inconsistente.

## What Changes

- **BUGFIX**: Corregir `mercadopago_service.py` — usa `pedido.estado` pero el modelo tiene `pedido.estado_codigo`, causando `AttributeError` al intentar crear una preferencia de MercadoPago.
- **BUGFIX**: Eliminar la función `transicionar_estado` duplicada en `mercadopago_service.py` y delegar a `pedido_service.transicionar_estado`.
- **BUGFIX**: Agregar UI de error en `CheckoutPage` para cuando falla `createMutation` (la creación del pedido), evitando el efecto de "no sucede nada".
- **UX**: Cuando el usuario está autenticado, el `CheckoutPage` pre-rellena `nombre` y `teléfono` desde el `authStore`.
- **UX**: Cuando el usuario está autenticado, el `CheckoutPage` carga sus direcciones guardadas (`GET /api/v1/direcciones?usuario_id=X`) y las presenta en un selector, en lugar de pedir texto libre.
- **UX**: Cuando el usuario selecciona una dirección guardada, el payload de `PedidoCreate` usa `usuario_id` + `direccion_id` (modo vinculado, ya soportado por el backend) en lugar de los campos libres.

## Capabilities

### New Capabilities

- `checkout-smart-prefill`: Lógica de pre-relleno del CheckoutPage con datos del usuario autenticado (nombre, teléfono, dirección guardada).

### Modified Capabilities

- `order-user-relationship`: El flujo de creación de pedidos ahora distingue entre modo libre (anónimo) y modo vinculado (usuario + dirección), usando el modo vinculado cuando hay sesión activa.

## Impact

- `backend/services/mercadopago_service.py` — corrección de campo y eliminación de lógica duplicada
- `frontend/src/pages/CheckoutPage.tsx` — pre-relleno de datos, selector de direcciones, manejo de error de pedido
- `frontend/src/services/api.ts` — ya tiene `direccionesApi` o se agrega
- Sin cambios de schema en base de datos ni breaking changes en la API
