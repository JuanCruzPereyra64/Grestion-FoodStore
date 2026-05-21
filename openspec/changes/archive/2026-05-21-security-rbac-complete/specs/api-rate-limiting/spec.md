## ADDED Requirements

### Requirement: Rate limiting en el endpoint de login

El sistema SHALL limitar los intentos de autenticación a 5 requests por IP en una ventana de 15 minutos en el endpoint `POST /api/v1/auth/login`. Al exceder el límite, SHALL responder con HTTP 429 Too Many Requests.

#### Scenario: Login dentro del límite

- **WHEN** una IP realiza 5 o menos intentos de login en una ventana de 15 minutos
- **THEN** el sistema procesa cada request normalmente
- **AND** devuelve la respuesta correspondiente (200, 401, etc.) sin interferencia del rate limiter

#### Scenario: Login excede el límite

- **WHEN** una IP realiza más de 5 intentos de login en una ventana de 15 minutos
- **THEN** el sistema responde con HTTP 429 Too Many Requests en el intento 6 en adelante
- **AND** el body incluye el detalle del error del rate limiter

#### Scenario: Ventana de rate limiting se reinicia

- **WHEN** transcurren 15 minutos desde el primer intento registrado para una IP
- **THEN** el contador se reinicia
- **AND** esa IP puede volver a realizar intentos de login

### Requirement: CORS configurable por variable de entorno

El sistema SHALL leer la lista de orígenes CORS permitidos desde la variable de entorno `CORS_ORIGINS` (valores separados por coma). Si la variable no está definida, SHALL usar `http://localhost:5173,http://localhost:5174` como valor por defecto.

#### Scenario: Variable CORS_ORIGINS definida

- **WHEN** la aplicación inicia con `CORS_ORIGINS=https://myfoodstore.com,https://admin.myfoodstore.com`
- **THEN** el middleware CORS permite solo esos dos orígenes
- **AND** requests desde otros orígenes reciben el error CORS correspondiente

#### Scenario: Variable CORS_ORIGINS no definida

- **WHEN** la aplicación inicia sin la variable `CORS_ORIGINS` en el entorno
- **THEN** el middleware CORS permite `http://localhost:5173` y `http://localhost:5174`
- **AND** el comportamiento es idéntico al anterior a este change
