## Why

Los routers del backend no tienen prefijo de versión, por lo que todos los endpoints están expuestos directamente como `/auth`, `/productos`, etc. Agregar `/api/v1` como prefijo global estandariza el contrato REST, desbloquea la FASE 1 del roadmap y es prerequisito para security-rbac-complete y cualquier versioning futuro.

## What Changes

- Agregar `prefix="/api/v1"` en cada `include_router(...)` en `backend/main.py`
- Actualizar `BASE_URL` en `frontend/src/services/api.ts` de `http://localhost:8000` a `http://localhost:8000/api/v1`
- Eliminar el segmento de recurso duplicado en las dos llamadas directas (`/pedidos/{id}/factura`, `/reportes/ventas/csv`, `/productos/imagen`) que ya incluyen su prefijo de router

## Capabilities

### New Capabilities
- `api-versioning`: Todos los endpoints del backend son accesibles bajo `/api/v1/*`. El frontend consume la API a través de `BASE_URL` centralizada con el prefijo incluido.

### Modified Capabilities

_(ninguna — no hay cambios de requisitos en specs existentes, solo cambio de ruta)_

## Impact

| Área | Impacto | Descripción |
|------|---------|-------------|
| `backend/main.py` | Modificado | `prefix="/api/v1"` en los 7 `include_router` |
| `frontend/src/services/api.ts` | Modificado | `BASE_URL` → `http://localhost:8000/api/v1` |
| Swagger UI | Automático | FastAPI refleja el prefijo sin cambios adicionales |
| Tests existentes | A revisar | Cualquier test que hardcodee rutas sin prefijo necesita actualización |
