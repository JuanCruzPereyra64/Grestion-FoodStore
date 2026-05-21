## 1. Dependencias y configuración

- [x] 1.1 Agregar `slowapi` y `limits` a `requirements.txt`
- [x] 1.2 Crear `backend/dependencies/limiter.py` con la instancia del `Limiter` (key: `request.client.host`)
- [x] 1.3 Registrar `SlowAPIMiddleware` y el handler de `RateLimitExceeded` en `backend/main.py`
- [x] 1.4 Reemplazar la lista hardcodeada de `allow_origins` en `main.py` por lectura desde `CORS_ORIGINS` env var (con fallback a `http://localhost:5173,http://localhost:5174`)
- [x] 1.5 Agregar `CORS_ORIGINS=http://localhost:5173,http://localhost:5174` a `.env.example`

## 2. Rate limiting en login

- [x] 2.1 Importar `limiter` en `backend/routers/auth.py`
- [x] 2.2 Agregar `request: Request` como primer parámetro al handler `POST /auth/login`
- [x] 2.3 Decorar el handler con `@limiter.limit("5/15minutes")`

## 3. Autorización en productos

- [x] 3.1 Importar `require_role` desde `backend.dependencies.auth` en `backend/routers/productos.py`
- [x] 3.2 Agregar `Depends(require_role(["ADMIN", "STOCK"]))` en `POST /productos/imagen`
- [x] 3.3 Agregar `Depends(require_role(["ADMIN", "STOCK"]))` en `POST /productos/`
- [x] 3.4 Agregar `Depends(require_role(["ADMIN", "STOCK"]))` en `PUT /productos/{id}`
- [x] 3.5 Agregar `Depends(require_role(["ADMIN", "STOCK"]))` en `DELETE /productos/{id}`
- [x] 3.6 Agregar `Depends(require_role(["ADMIN", "STOCK"]))` en `POST /productos/{id}/ingredientes`
- [x] 3.7 Agregar `Depends(require_role(["ADMIN", "STOCK"]))` en `DELETE /productos/{id}/ingredientes/{ingrediente_id}`

## 4. Autorización en categorías

- [x] 4.1 Importar `require_role` en `backend/routers/categorias.py`
- [x] 4.2 Agregar `Depends(require_role(["ADMIN", "STOCK"]))` en `POST /categorias/`
- [x] 4.3 Agregar `Depends(require_role(["ADMIN", "STOCK"]))` en `PUT /categorias/{id}`
- [x] 4.4 Agregar `Depends(require_role(["ADMIN", "STOCK"]))` en `DELETE /categorias/{id}`

## 5. Autorización en ingredientes

- [x] 5.1 Importar `require_role` en `backend/routers/ingredientes.py`
- [x] 5.2 Agregar `Depends(require_role(["ADMIN", "STOCK"]))` en `POST /ingredientes/`
- [x] 5.3 Agregar `Depends(require_role(["ADMIN", "STOCK"]))` en `PUT /ingredientes/{id}`
- [x] 5.4 Agregar `Depends(require_role(["ADMIN", "STOCK"]))` en `DELETE /ingredientes/{id}`

## 6. Autorización en pedidos

- [x] 6.1 Importar `require_role` en `backend/routers/pedidos.py`
- [x] 6.2 Agregar `Depends(require_role(["CLIENT"]))` en `POST /pedidos/`
- [x] 6.3 Agregar `Depends(require_role(["PEDIDOS", "ADMIN"]))` en `PATCH /pedidos/{id}/estado`
- [x] 6.4 Agregar `Depends(require_role(["CLIENT", "ADMIN"]))` en `DELETE /pedidos/{id}`
- [x] 6.5 Agregar `Depends(require_role(["PEDIDOS", "ADMIN"]))` en `POST /pedidos/{id}/factura`

## 7. Autorización en reportes

- [x] 7.1 Importar `require_role` en `backend/routers/reportes.py`
- [x] 7.2 Agregar `Depends(require_role(["ADMIN"]))` en `GET /reportes/estadisticas`
- [x] 7.3 Agregar `Depends(require_role(["ADMIN"]))` en `GET /reportes/ventas/csv`
