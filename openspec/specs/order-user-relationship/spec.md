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

#### Scenario: Forma de pago inválida
- **WHEN** se envía `POST /api/v1/pedidos` con `forma_pago_codigo` que no existe en el catálogo `formas_pago`
- **THEN** el sistema responde `422 Unprocessable Entity`

#### Scenario: Dirección inexistente
- **WHEN** se envía `POST /api/v1/pedidos` con `direccion_id` que no existe
- **THEN** el sistema responde `404 Not Found` con mensaje indicando que la dirección no fue encontrada

---

### Requirement: Listar pedidos por usuario
El sistema SHALL permitir filtrar pedidos por usuario mediante `GET /api/v1/pedidos?usuario_id={id}`.

#### Scenario: Usuario con pedidos
- **WHEN** se envía `GET /api/v1/pedidos?usuario_id=1` y el usuario tiene pedidos
- **THEN** el sistema responde `200 OK` con la lista de pedidos pertenecientes a ese usuario

#### Scenario: Usuario sin pedidos
- **WHEN** se envía `GET /api/v1/pedidos?usuario_id=999` y el usuario no tiene pedidos
- **THEN** el sistema responde `200 OK` con lista vacía `[]`

#### Scenario: Sin filtro de usuario
- **WHEN** se envía `GET /api/v1/pedidos` sin parámetro `usuario_id`
- **THEN** el sistema responde `200 OK` con todos los pedidos

---

### Requirement: Respuesta de pedido incluye referencias al usuario y dirección
El sistema SHALL incluir `usuario_id`, `direccion_id` y `forma_pago_codigo` en la respuesta de lectura de un pedido.

#### Scenario: GET pedido existente con vínculos
- **WHEN** se envía `GET /api/v1/pedidos/{id}` para un pedido creado con `usuario_id` y `direccion_id`
- **THEN** el sistema responde `200 OK` con los campos `usuario_id`, `direccion_id`, `forma_pago_codigo`, `cliente_nombre` y `direccion_snapshot` presentes en la respuesta

#### Scenario: GET pedido legacy sin vínculos
- **WHEN** se envía `GET /api/v1/pedidos/{id}` para un pedido creado antes de este change (con `usuario_id` null)
- **THEN** el sistema responde `200 OK` con `usuario_id: null` y `direccion_id: null` en la respuesta

---

### Requirement: Snapshot de estado usa catálogo EstadoPedido
El sistema SHALL almacenar el campo `estado_codigo` del pedido como FK a `estados_pedido.codigo`. El valor inicial al crear un pedido SHALL ser `"PENDIENTE"`.

#### Scenario: Estado inicial al crear pedido
- **WHEN** se crea un pedido exitosamente
- **THEN** el pedido tiene `estado_codigo = "PENDIENTE"` en la respuesta

#### Scenario: Transición de estado válida no se ve afectada
- **WHEN** se ejecuta una transición de estado válida según el FSM
- **THEN** el campo `estado_codigo` se actualiza al nuevo estado y el cambio se registra en `historial_estado_pedido`
