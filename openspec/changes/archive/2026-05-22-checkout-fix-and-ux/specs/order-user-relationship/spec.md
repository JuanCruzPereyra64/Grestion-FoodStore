## MODIFIED Requirements

### Requirement: Crear pedido vinculado a usuario y dirección
El sistema SHALL soportar dos modos de creación de pedido en `POST /api/v1/pedidos`:

**Modo vinculado** (usuario autenticado con dirección guardada): el cliente SHALL enviar `usuario_id` y `direccion_id`. El sistema SHALL derivar `cliente_nombre` de `Usuario.nombre` y `direccion_snapshot` de la `DireccionEntrega` correspondiente.

**Modo libre** (usuario anónimo o sin dirección guardada): el cliente SHALL enviar `cliente_nombre`, `direccion` y opcionalmente `telefono` y `zona_envio` como texto libre. El campo `usuario_id` es opcional en este modo.

#### Scenario: Creación exitosa en modo vinculado
- **WHEN** se envía `POST /api/v1/pedidos` con `usuario_id` existente, `direccion_id` que pertenece al mismo usuario, `forma_pago_codigo` válido e `items` no vacío
- **THEN** el sistema responde `201 Created` con el pedido incluyendo `usuario_id`, `direccion_id`, `cliente_nombre` (snapshot del usuario) y `direccion_snapshot` (texto formateado de la dirección)

#### Scenario: Creación exitosa en modo libre
- **WHEN** se envía `POST /api/v1/pedidos` con `cliente_nombre`, `direccion` e `items` no vacío, sin `usuario_id` ni `direccion_id`
- **THEN** el sistema responde `201 Created` con el pedido usando los datos de texto libre provistos

#### Scenario: Usuario inexistente
- **WHEN** se envía `POST /api/v1/pedidos` con `usuario_id` que no existe en la base
- **THEN** el sistema responde `404 Not Found` con mensaje indicando que el usuario no fue encontrado

#### Scenario: Dirección no pertenece al usuario
- **WHEN** se envía `POST /api/v1/pedidos` con `direccion_id` que existe pero pertenece a un usuario diferente al `usuario_id` enviado
- **THEN** el sistema responde `403 Forbidden` con mensaje indicando que la dirección no pertenece al usuario

#### Scenario: Dirección inexistente
- **WHEN** se envía `POST /api/v1/pedidos` con `direccion_id` que no existe
- **THEN** el sistema responde `404 Not Found` con mensaje indicando que la dirección no fue encontrada
