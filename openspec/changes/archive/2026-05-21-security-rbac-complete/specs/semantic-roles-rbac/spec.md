## ADDED Requirements

### Requirement: Escritura de productos requiere rol ADMIN o STOCK

Los endpoints de escritura del recurso `productos` SHALL requerir que el usuario autenticado tenga al menos uno de los roles `ADMIN` o `STOCK`. Los endpoints de lectura (`GET`) SHALL permanecer públicos.

#### Scenario: Usuario ADMIN crea un producto

- **WHEN** un usuario con rol `ADMIN` realiza `POST /api/v1/productos`
- **THEN** el sistema procesa la creación y devuelve 201 Created

#### Scenario: Usuario sin rol STOCK ni ADMIN intenta crear un producto

- **WHEN** un usuario con rol `CLIENT` realiza `POST /api/v1/productos`
- **THEN** el sistema devuelve 403 Forbidden
- **AND** el producto no es creado

#### Scenario: Usuario STOCK actualiza o elimina un producto

- **WHEN** un usuario con rol `STOCK` realiza `PUT /api/v1/productos/{id}` o `DELETE /api/v1/productos/{id}`
- **THEN** el sistema procesa la operación y devuelve la respuesta correspondiente (200 o 204)

#### Scenario: Lectura pública de productos no requiere autenticación

- **WHEN** un cliente sin token realiza `GET /api/v1/productos`
- **THEN** el sistema devuelve 200 con la lista de productos
- **AND** no se requiere encabezado Authorization

### Requirement: Escritura de categorías e ingredientes requiere rol ADMIN o STOCK

Los endpoints de escritura de `categorias` e `ingredientes` SHALL requerir rol `ADMIN` o `STOCK`. Los `GET` SHALL permanecer públicos.

#### Scenario: Usuario STOCK modifica una categoría

- **WHEN** un usuario con rol `STOCK` realiza `PUT /api/v1/categorias/{id}`
- **THEN** el sistema procesa la actualización y devuelve 200

#### Scenario: Usuario CLIENT intenta eliminar un ingrediente

- **WHEN** un usuario con rol `CLIENT` realiza `DELETE /api/v1/ingredientes/{id}`
- **THEN** el sistema devuelve 403 Forbidden

### Requirement: Creación de pedidos requiere rol CLIENT

El endpoint `POST /api/v1/pedidos` SHALL requerir que el usuario autenticado tenga el rol `CLIENT`.

#### Scenario: Usuario CLIENT crea un pedido

- **WHEN** un usuario con rol `CLIENT` realiza `POST /api/v1/pedidos`
- **THEN** el sistema procesa el pedido y devuelve 201 Created

#### Scenario: Usuario sin rol CLIENT intenta crear un pedido

- **WHEN** un usuario con rol `ADMIN` (sin rol `CLIENT`) realiza `POST /api/v1/pedidos`
- **THEN** el sistema devuelve 403 Forbidden

### Requirement: Transición de estado de pedidos requiere rol PEDIDOS o ADMIN

El endpoint `PATCH /api/v1/pedidos/{id}/estado` SHALL requerir rol `PEDIDOS` o `ADMIN`.

#### Scenario: Usuario PEDIDOS transiciona el estado de un pedido

- **WHEN** un usuario con rol `PEDIDOS` realiza `PATCH /api/v1/pedidos/{id}/estado`
- **THEN** el sistema procesa la transición y devuelve la respuesta del FSM

#### Scenario: Usuario CLIENT intenta transicionar el estado

- **WHEN** un usuario con rol `CLIENT` realiza `PATCH /api/v1/pedidos/{id}/estado`
- **THEN** el sistema devuelve 403 Forbidden

### Requirement: Cancelación de pedidos requiere rol CLIENT o ADMIN

El endpoint `DELETE /api/v1/pedidos/{id}` SHALL requerir rol `CLIENT` o `ADMIN`.

#### Scenario: Usuario CLIENT cancela un pedido

- **WHEN** un usuario con rol `CLIENT` realiza `DELETE /api/v1/pedidos/{id}`
- **THEN** el sistema procesa la cancelación (sujeto a reglas FSM)

### Requirement: Generación de factura requiere rol PEDIDOS o ADMIN

El endpoint `POST /api/v1/pedidos/{id}/factura` SHALL requerir rol `PEDIDOS` o `ADMIN`.

#### Scenario: Usuario PEDIDOS genera una factura

- **WHEN** un usuario con rol `PEDIDOS` realiza `POST /api/v1/pedidos/{id}/factura`
- **THEN** el sistema genera y devuelve la factura

#### Scenario: Usuario CLIENT intenta generar una factura

- **WHEN** un usuario con rol `CLIENT` realiza `POST /api/v1/pedidos/{id}/factura`
- **THEN** el sistema devuelve 403 Forbidden

### Requirement: Reportes requieren rol ADMIN

Todos los endpoints bajo `/api/v1/reportes` SHALL requerir rol `ADMIN`.

#### Scenario: Usuario ADMIN accede a estadísticas

- **WHEN** un usuario con rol `ADMIN` realiza `GET /api/v1/reportes/estadisticas`
- **THEN** el sistema devuelve las estadísticas con 200

#### Scenario: Usuario sin rol ADMIN accede a reportes

- **WHEN** un usuario con rol `STOCK` o `CLIENT` realiza cualquier `GET /api/v1/reportes/**`
- **THEN** el sistema devuelve 403 Forbidden
