## Why

El backend tiene autenticación JWT funcional y roles definidos (`ADMIN`, `STOCK`, `PEDIDOS`, `CLIENT`), pero ningún endpoint aplica control de acceso por rol: cualquier usuario autenticado puede ejecutar cualquier operación. Este change cierra esa brecha aplicando `require_role` en todos los endpoints que lo requieren, agrega rate limiting en el login para prevenir ataques de fuerza bruta, y externaliza la configuración de CORS a variables de entorno.

## What Changes

- **Rate limiting en login**: `slowapi` limita a 5 intentos por IP cada 15 minutos en `POST /api/v1/auth/login`. Devuelve `429 Too Many Requests` al exceder el límite.
- **Autorización por rol en `productos.py`**: escritura (`POST`, `PUT`, `DELETE`) requiere rol `ADMIN` o `STOCK`.
- **Autorización por rol en `categorias.py`**: escritura (`POST`, `PUT`, `DELETE`) requiere rol `ADMIN` o `STOCK`.
- **Autorización por rol en `ingredientes.py`**: escritura (`POST`, `PUT`, `DELETE`) requiere rol `ADMIN` o `STOCK`.
- **Autorización por rol en `pedidos.py`**: `POST` requiere `CLIENT`; `PATCH /{id}/estado` requiere `PEDIDOS` o `ADMIN`; `DELETE /{id}` requiere `CLIENT` (solo propios) o `ADMIN`.
- **Autorización por rol en `reportes.py`**: todos los endpoints requieren `ADMIN`.
- **CORS desde entorno**: `CORS_ORIGINS` se lee de variable de entorno; `main.py` no tiene URLs hardcodeadas.

## Capabilities

### New Capabilities

- `api-rate-limiting`: Rate limiting sobre el endpoint de autenticación usando `slowapi`. Evita ataques de fuerza bruta sobre `/api/v1/auth/login`.

### Modified Capabilities

- `semantic-roles-rbac`: Extiende los requisitos existentes de la spec para cubrir la aplicación efectiva de `require_role` en cada router (`productos`, `categorias`, `ingredientes`, `pedidos`, `reportes`), con los roles exactos requeridos por endpoint y el comportamiento esperado ante acceso no autorizado (`403 Forbidden`).

## Impact

- **`backend/main.py`**: agrega `slowapi` y `SlowAPIMiddleware`; mueve `CORS_ORIGINS` a env var.
- **`backend/routers/productos.py`**: agrega `require_role` a endpoints de escritura.
- **`backend/routers/categorias.py`**: agrega `require_role` a endpoints de escritura.
- **`backend/routers/ingredientes.py`**: agrega `require_role` a endpoints de escritura.
- **`backend/routers/pedidos.py`**: agrega `require_role` diferenciado por operación.
- **`backend/routers/reportes.py`**: agrega `require_role(["ADMIN"])` a todos los endpoints.
- **`backend/services/auth_service.py`**: agrega decorador `@limiter.limit` en el handler de login.
- **`.env` / `.env.example`**: nueva variable `CORS_ORIGINS`.
- **Dependencias**: `slowapi` y `limits` deben agregarse a `requirements.txt`.
