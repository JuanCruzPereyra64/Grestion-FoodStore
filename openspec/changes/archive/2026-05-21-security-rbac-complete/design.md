## Context

El sistema tiene JWT funcional y `require_role` implementado correctamente en `backend/dependencies/auth.py:69`. El factory pattern está bien resuelto: `require_role(["ADMIN"])` retorna un callable que FastAPI puede usar como dependencia. Sin embargo, ningún router importa ni aplica `require_role`. Todos los endpoints de escritura son accesibles por cualquier usuario autenticado (o sin autenticación).

El login (`POST /api/v1/auth/login`) tampoco tiene rate limiting, dejando abierta la puerta a ataques de fuerza bruta.

CORS está hardcodeado en `main.py` con `["http://localhost:5173", "http://localhost:5174"]`, lo que obliga a cambiar código para cada entorno.

## Goals / Non-Goals

**Goals:**
- Aplicar `require_role` en todos los routers con la lista de roles correcta por endpoint.
- Agregar rate limiting `5 req/15 min por IP` en `POST /api/v1/auth/login` usando `slowapi`.
- Mover los orígenes CORS a la variable de entorno `CORS_ORIGINS`.

**Non-Goals:**
- No se cambia la lógica de negocio de ningún servicio.
- No se implementa autorización a nivel de recurso (e.g. "solo el dueño puede ver su pedido") — eso queda fuera de scope.
- No se agregan nuevos roles ni se cambia la estructura de la tabla `roles`.
- No se implementa IP banning ni CAPTCHA.

## Decisions

### 1. Reusar `require_role` existente sin modificarlo

`backend/dependencies/auth.py:69` ya implementa el factory pattern correctamente. Cada router importa `require_role` y lo pasa como `Depends(require_role(["ROL"]))` en cada endpoint que lo necesite.

**Alternativa descartada**: decoradores custom o middleware de autorización. El factory como dependency es más explícito, testeable, y consistente con el patrón FastAPI.

### 2. `slowapi` para rate limiting en login

`slowapi` es el estándar de facto para rate limiting en FastAPI. Integra con el sistema de middlewares de Starlette. El límite es `5/15minutes` por IP, configurado con la key `request.client.host`.

**Alternativa descartada**: rate limiting manual con Redis o memoria. `slowapi` es suficiente para la carga de este sistema y no agrega complejidad operacional.

**Dónde se configura**: el `Limiter` se instancia en `backend/dependencies/auth.py` (o en un módulo separado `backend/dependencies/limiter.py`) y se registra en `main.py` vía `SlowAPIMiddleware`.

**Dónde se aplica**: en el endpoint de login en `backend/routers/auth.py` con `@limiter.limit("5/15minutes")`.

### 3. CORS_ORIGINS desde variable de entorno

`main.py` leerá `os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174")` y la splitteará por coma para construir la lista `allow_origins`. El valor por defecto preserva el comportamiento actual en desarrollo.

### 4. Reglas de acceso por router

| Router | Operación | Roles requeridos |
|---|---|---|
| `productos` | `POST /`, `PUT /{id}`, `DELETE /{id}`, `POST /{id}/ingredientes`, `DELETE /{id}/ingredientes/{i}`, `POST /imagen` | `ADMIN` o `STOCK` |
| `categorias` | `POST /`, `PUT /{id}`, `DELETE /{id}` | `ADMIN` o `STOCK` |
| `ingredientes` | `POST /`, `PUT /{id}`, `DELETE /{id}` | `ADMIN` o `STOCK` |
| `pedidos` | `POST /` | `CLIENT` |
| `pedidos` | `PATCH /{id}/estado` | `PEDIDOS` o `ADMIN` |
| `pedidos` | `DELETE /{id}` | `CLIENT` o `ADMIN` |
| `pedidos` | `POST /{id}/factura` | `PEDIDOS` o `ADMIN` |
| `reportes` | todos | `ADMIN` |

Los `GET` de lectura pública (catálogo de productos, categorías, ingredientes) no requieren autenticación — siguen siendo accesibles sin token.

## Risks / Trade-offs

- **slowapi y Request param**: los endpoints con rate limiting deben agregar `request: Request` como primer parámetro, lo que cambia la firma del handler de login. No rompe nada pero hay que asegurarse de que el decorador `@limiter.limit` se aplique después de `@router.post`.
- **CORS_ORIGINS en .env no incluida en .env.example**: si el desarrollador no copia la variable, recibe CORS errors silenciosos. Mitigación: agregar `CORS_ORIGINS` al `.env.example` con el valor por defecto.
- **require_role en `DELETE /pedidos/{id}` para `CLIENT`**: el rol `CLIENT` puede cancelar pedidos, pero sin verificar si el pedido le pertenece. En scope de este change solo se valida el rol; la propiedad del recurso es un future concern.
