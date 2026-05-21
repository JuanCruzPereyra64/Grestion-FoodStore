## ADDED Requirements

### Requirement: Crear dirección de entrega
El sistema SHALL permitir crear una dirección de entrega asociada a un usuario mediante `POST /api/v1/direcciones`. El cuerpo SHALL contener `usuario_id`, `alias`, `linea1`, `ciudad` y `cp`. El campo `es_principal` SHALL ser `false` por defecto si no se especifica.

#### Scenario: Creación exitosa
- **WHEN** se envía `POST /api/v1/direcciones` con `usuario_id`, `alias`, `linea1`, `ciudad` y `cp` válidos
- **THEN** el sistema responde `201 Created` con la dirección creada incluyendo su `id` y `es_principal: false`

#### Scenario: Campos obligatorios faltantes
- **WHEN** se envía `POST /api/v1/direcciones` sin `linea1`
- **THEN** el sistema responde `422 Unprocessable Entity`

### Requirement: Listar direcciones de un usuario
El sistema SHALL permitir obtener todas las direcciones de un usuario mediante `GET /api/v1/direcciones?usuario_id={id}`.

#### Scenario: Usuario con direcciones
- **WHEN** se envía `GET /api/v1/direcciones?usuario_id=1`
- **THEN** el sistema responde `200 OK` con la lista de direcciones del usuario

#### Scenario: Usuario sin direcciones
- **WHEN** se envía `GET /api/v1/direcciones?usuario_id=999` para un usuario sin direcciones
- **THEN** el sistema responde `200 OK` con lista vacía `[]`

### Requirement: Obtener dirección por ID
El sistema SHALL permitir obtener una dirección específica mediante `GET /api/v1/direcciones/{id}`.

#### Scenario: Dirección existente
- **WHEN** se envía `GET /api/v1/direcciones/1`
- **THEN** el sistema responde `200 OK` con los datos de la dirección

#### Scenario: Dirección inexistente
- **WHEN** se envía `GET /api/v1/direcciones/9999`
- **THEN** el sistema responde `404 Not Found`

### Requirement: Actualizar dirección
El sistema SHALL permitir actualizar los campos de una dirección mediante `PUT /api/v1/direcciones/{id}`. Todos los campos son opcionales en el body.

#### Scenario: Actualización exitosa
- **WHEN** se envía `PUT /api/v1/direcciones/1` con `{"alias": "Oficina"}`
- **THEN** el sistema responde `200 OK` con la dirección actualizada

#### Scenario: Dirección inexistente
- **WHEN** se envía `PUT /api/v1/direcciones/9999` con datos válidos
- **THEN** el sistema responde `404 Not Found`

### Requirement: Eliminar dirección
El sistema SHALL permitir eliminar una dirección mediante `DELETE /api/v1/direcciones/{id}`.

#### Scenario: Eliminación exitosa
- **WHEN** se envía `DELETE /api/v1/direcciones/1`
- **THEN** el sistema responde `204 No Content` y la dirección ya no existe

#### Scenario: Dirección inexistente
- **WHEN** se envía `DELETE /api/v1/direcciones/9999`
- **THEN** el sistema responde `404 Not Found`

### Requirement: Marcar dirección como principal
El sistema SHALL permitir marcar una dirección como principal mediante `PATCH /api/v1/direcciones/{id}/principal`. El sistema SHALL garantizar que solo una dirección por usuario tenga `es_principal=True` — todas las demás del mismo usuario SHALL quedar en `False`.

#### Scenario: Marcar principal exitoso
- **WHEN** se envía `PATCH /api/v1/direcciones/2/principal` y el usuario tiene las direcciones 1 (principal) y 2
- **THEN** el sistema responde `200 OK` con la dirección 2 marcada como principal y la dirección 1 queda `es_principal: false`

#### Scenario: Dirección inexistente
- **WHEN** se envía `PATCH /api/v1/direcciones/9999/principal`
- **THEN** el sistema responde `404 Not Found`

### Requirement: Catálogos EstadoPedido y FormaPago sembrados
El sistema SHALL sembrar al iniciar las tablas `estados_pedido` y `formas_pago` con los registros catálogo. El seed SHALL ser idempotente.

#### Scenario: Seed idempotente de EstadoPedido
- **WHEN** el backend inicia por primera vez o se reinicia
- **THEN** la tabla `estados_pedido` contiene exactamente: PENDIENTE, CONFIRMADO, EN_PREPARACION, LISTO, ENTREGADO, CANCELADO sin duplicados

#### Scenario: Seed idempotente de FormaPago
- **WHEN** el backend inicia por primera vez o se reinicia
- **THEN** la tabla `formas_pago` contiene exactamente: EFECTIVO, MERCADOPAGO sin duplicados
