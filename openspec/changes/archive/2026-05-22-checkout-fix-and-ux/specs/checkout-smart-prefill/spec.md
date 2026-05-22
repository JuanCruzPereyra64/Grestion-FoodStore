## ADDED Requirements

### Requirement: Pre-relleno de datos del usuario autenticado en checkout
El sistema SHALL pre-rellenar automáticamente los campos `nombre` y `teléfono` del checkout con los datos del usuario autenticado disponibles en el store de sesión. Los campos SHALL ser editables por el usuario.

#### Scenario: Usuario autenticado con teléfono cargado
- **WHEN** un usuario autenticado navega a `/checkout`
- **THEN** los campos nombre y teléfono aparecen pre-rellenos con los valores de su perfil

#### Scenario: Usuario autenticado sin teléfono
- **WHEN** un usuario autenticado navega a `/checkout` y su perfil no tiene teléfono registrado
- **THEN** el campo nombre aparece pre-relleno y el campo teléfono aparece vacío

#### Scenario: Usuario no autenticado
- **WHEN** un usuario no autenticado navega a `/checkout`
- **THEN** todos los campos aparecen vacíos y el usuario debe completarlos manualmente

---

### Requirement: Selector de dirección guardada para usuarios autenticados
El sistema SHALL presentar un selector de direcciones guardadas cuando el usuario autenticado tiene al menos una dirección registrada en `GET /api/v1/direcciones?usuario_id=X`. El campo de texto libre de dirección SHALL reemplazarse por dicho selector.

#### Scenario: Usuario con direcciones guardadas
- **WHEN** un usuario autenticado navega a `/checkout` y tiene al menos una dirección guardada
- **THEN** el checkout muestra un selector con sus direcciones disponibles en lugar del campo de texto libre

#### Scenario: Dirección principal pre-seleccionada
- **WHEN** un usuario autenticado tiene una dirección marcada como `es_principal: true`
- **THEN** esa dirección aparece pre-seleccionada en el selector

#### Scenario: Usuario sin direcciones guardadas
- **WHEN** un usuario autenticado navega a `/checkout` y no tiene ninguna dirección guardada
- **THEN** el checkout muestra el campo de texto libre para ingresar la dirección manualmente

---

### Requirement: Modo vinculado al confirmar pedido con dirección guardada
Cuando el usuario selecciona una dirección guardada, el sistema SHALL enviar `usuario_id` y `direccion_id` en el payload de `PedidoCreate` (modo vinculado) en lugar de los campos de texto libre.

#### Scenario: Confirmación con dirección guardada
- **WHEN** el usuario autenticado selecciona una dirección guardada y confirma el pedido
- **THEN** el payload enviado a `POST /api/v1/pedidos` incluye `usuario_id` y `direccion_id`, sin campos de texto libre de nombre o dirección

#### Scenario: Confirmación sin dirección guardada (modo libre)
- **WHEN** el usuario confirma el pedido sin seleccionar una dirección guardada
- **THEN** el payload enviado incluye los campos de texto libre `cliente_nombre`, `telefono`, `direccion`, `zona_envio`

---

### Requirement: Feedback de error visible al fallar la creación del pedido
El sistema SHALL mostrar un mensaje de error legible al usuario cuando `POST /api/v1/pedidos` devuelve un error, en lugar de no dar ningún feedback visual.

#### Scenario: Error en creación de pedido
- **WHEN** la llamada a `POST /api/v1/pedidos` falla con cualquier código de error
- **THEN** el checkout muestra una pantalla de error con el mensaje recibido y una opción para reintentar

---

### Requirement: Corrección del campo de estado en integración MercadoPago
El servicio `mercadopago_service` SHALL usar el campo `estado_codigo` del modelo `Pedido` (no `estado`) para verificar y transicionar el estado del pedido.

#### Scenario: Creación de preferencia para pedido PENDIENTE
- **WHEN** se llama a `POST /api/v1/pagos/create_preference` con un `pedido_id` cuyo `estado_codigo` es `"PENDIENTE"`
- **THEN** el sistema crea la preferencia en MercadoPago y retorna `init_point` sin error 500

#### Scenario: Rechazo de pedido no PENDIENTE
- **WHEN** se llama a `POST /api/v1/pagos/create_preference` con un `pedido_id` cuyo `estado_codigo` no es `"PENDIENTE"`
- **THEN** el sistema retorna `400 Bad Request` con mensaje descriptivo
