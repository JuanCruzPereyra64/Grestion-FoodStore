## 1. Backend — Agregar prefijo /api/v1 en main.py

- [x] 1.1 Agregar `prefix="/api/v1"` al `include_router(auth.router)` en `backend/main.py`
- [x] 1.2 Agregar `prefix="/api/v1"` al `include_router(productos.router)` en `backend/main.py`
- [x] 1.3 Agregar `prefix="/api/v1"` al `include_router(categorias.router)` en `backend/main.py`
- [x] 1.4 Agregar `prefix="/api/v1"` al `include_router(ingredientes.router)` en `backend/main.py`
- [x] 1.5 Agregar `prefix="/api/v1"` al `include_router(pedidos.router)` en `backend/main.py`
- [x] 1.6 Agregar `prefix="/api/v1"` al `include_router(pagos.router)` en `backend/main.py`
- [x] 1.7 Agregar `prefix="/api/v1"` al `include_router(reportes.router)` en `backend/main.py`

## 2. Frontend — Actualizar BASE_URL en api.ts

- [x] 2.1 Cambiar `BASE_URL` de `'http://localhost:8000'` a `'http://localhost:8000/api/v1'` en `frontend/src/services/api.ts`

## 3. Verificación

- [x] 3.1 Levantar el backend y verificar que `GET http://localhost:8000/api/v1/productos` responde `200 OK`
- [x] 3.2 Verificar que `GET http://localhost:8000/productos` responde `404 Not Found` (ruta sin prefijo eliminada)
- [x] 3.3 Levantar el frontend y verificar que el listado de productos carga correctamente
- [x] 3.4 Verificar que el login funciona correctamente con el nuevo prefijo
