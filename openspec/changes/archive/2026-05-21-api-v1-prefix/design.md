## Context

El backend FastAPI expone actualmente 7 routers sin prefijo de versión (`/auth`, `/productos`, `/categorias`, `/ingredientes`, `/pedidos`, `/pagos`, `/reportes`). El frontend consume desde `BASE_URL = 'http://localhost:8000'` y construye las rutas concatenando el segmento de recurso. Esta es una refactorización de routing pura — no hay cambios de lógica de negocio.

## Goals / Non-Goals

**Goals:**
- Todos los endpoints responden bajo `/api/v1/*`
- `BASE_URL` del frontend queda en `http://localhost:8000/api/v1` y no se repite en ningún otro lugar
- El Swagger UI refleja las rutas actualizadas automáticamente

**Non-Goals:**
- No se agrega autenticación ni rate limiting (eso es `security-rbac-complete`)
- No se versiona lógica de negocio — solo el prefijo de ruta
- No se migran tests de integración (no existen actualmente)

## Decisions

### D1: Prefijo en `include_router` (main.py) vs en cada `APIRouter`

**Elegido**: `prefix="/api/v1"` en cada `include_router(...)` en `main.py`.

**Alternativa descartada**: Agregar el prefijo directo en `APIRouter(prefix="/api/v1/productos")` en cada router.

**Rationale**: Centralizar en `main.py` permite cambiar la versión en un solo lugar. Los routers quedan agnósticos a la versión, reutilizables si algún día se necesita montar `/api/v2`.

```python
# main.py — patrón a aplicar
app.include_router(auth.router,         prefix="/api/v1")
app.include_router(productos.router,    prefix="/api/v1")
app.include_router(categorias.router,   prefix="/api/v1")
app.include_router(ingredientes.router, prefix="/api/v1")
app.include_router(pedidos.router,      prefix="/api/v1")
app.include_router(pagos.router,        prefix="/api/v1")
app.include_router(reportes.router,     prefix="/api/v1")
```

Resultado: `/auth/login` → `/api/v1/auth/login`, etc.

### D2: Rutas directas en api.ts

`api.ts` tiene 3 llamadas que no usan la función `apiFetch` genérica sino `fetch(${BASE_URL}/recurso/...)` directas:
- `${BASE_URL}/pedidos/${pedidoId}/factura`
- `${BASE_URL}/reportes/ventas/csv`
- `${BASE_URL}/productos/imagen`

Con el nuevo `BASE_URL = 'http://localhost:8000/api/v1'` estas rutas quedan correctas automáticamente — no hay `/api/v1` hardcodeado en ellas, solo el segmento de recurso. **Sin cambios adicionales necesarios.**

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| MercadoPago webhook hardcodeado en backend o panel MP con URL vieja | Revisar `pagos.py` — si existe `notify_url` construida con la ruta anterior, actualizarla |
| Variables de entorno que hardcodeen la URL base | Buscar `BACKEND_URL` o similar en `.env*` y actualizar |
| Swagger/OpenAPI docs URL en documentación externa | Fuera de scope para esta iteración |
