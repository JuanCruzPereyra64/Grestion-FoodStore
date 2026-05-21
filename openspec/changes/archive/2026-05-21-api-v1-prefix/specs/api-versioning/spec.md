## ADDED Requirements

### Requirement: API expuesta bajo prefijo versionado /api/v1
Todos los routers del backend SHALL estar montados bajo el prefijo `/api/v1`, de modo que cada endpoint sea accesible en `/api/v1/<recurso>/<ruta>`. No SHALL existir ningún endpoint de negocio accesible en rutas sin el prefijo `/api/v1`.

#### Scenario: Endpoint de auth accesible con prefijo
- **WHEN** el cliente envía `POST /api/v1/auth/login` con credenciales válidas
- **THEN** el servidor responde con `200 OK` y el token de acceso

#### Scenario: Ruta sin prefijo no existe
- **WHEN** el cliente envía `POST /auth/login`
- **THEN** el servidor responde con `404 Not Found`

#### Scenario: Endpoints de productos accesibles con prefijo
- **WHEN** el cliente envía `GET /api/v1/productos`
- **THEN** el servidor responde con `200 OK` y la lista de productos

#### Scenario: Endpoints de categorías accesibles con prefijo
- **WHEN** el cliente envía `GET /api/v1/categorias`
- **THEN** el servidor responde con `200 OK` y la lista de categorías

#### Scenario: Endpoints de ingredientes accesibles con prefijo
- **WHEN** el cliente envía `GET /api/v1/ingredientes`
- **THEN** el servidor responde con `200 OK` y la lista de ingredientes

#### Scenario: Endpoints de pedidos accesibles con prefijo
- **WHEN** el cliente envía `GET /api/v1/pedidos`
- **THEN** el servidor responde con `200 OK` o `401 Unauthorized` según autenticación

#### Scenario: Endpoints de pagos accesibles con prefijo
- **WHEN** el cliente envía `POST /api/v1/pagos/crear-preferencia` con datos válidos
- **THEN** el servidor responde con `200 OK` y la preferencia de MercadoPago

#### Scenario: Endpoints de reportes accesibles con prefijo
- **WHEN** el cliente envía `GET /api/v1/reportes/ventas`
- **THEN** el servidor responde con `200 OK` o `401 Unauthorized` según autenticación

### Requirement: Frontend consume API desde BASE_URL con prefijo incluido
El frontend SHALL definir `BASE_URL = 'http://localhost:8000/api/v1'` como única fuente de verdad. Ninguna llamada de red SHALL construir la URL base manualmente con el prefijo `/api/v1` de forma adicional.

#### Scenario: Llamada genérica respeta BASE_URL
- **WHEN** el frontend ejecuta cualquier llamada a través de `apiFetch`
- **THEN** la URL resultante comienza con `http://localhost:8000/api/v1/`

#### Scenario: Llamadas directas de descarga respetan BASE_URL
- **WHEN** el frontend descarga una factura en PDF (`/pedidos/{id}/factura`) o un CSV de reportes (`/reportes/ventas/csv`)
- **THEN** la URL usada es `${BASE_URL}/pedidos/{id}/factura` o `${BASE_URL}/reportes/ventas/csv` sin duplicar el prefijo
