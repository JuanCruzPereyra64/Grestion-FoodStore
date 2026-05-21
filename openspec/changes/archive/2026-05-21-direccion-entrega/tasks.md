## 1. Modelos

- [x] 1.1 Crear `backend/models/direccion.py` con el modelo `DireccionEntrega` (id, usuario_id FK, alias, linea1, ciudad, cp, es_principal)
- [x] 1.2 Agregar modelos `EstadoPedido` y `FormaPago` en `backend/models/pedido.py` (PK semántica `codigo: str`)
- [x] 1.3 Exportar `DireccionEntrega`, `EstadoPedido`, `FormaPago` en `backend/models/__init__.py`

## 2. Schema

- [x] 2.1 Crear `backend/schemas/direccion.py` con `DireccionCreate`, `DireccionUpdate` (campos opcionales), `DireccionRead`

## 3. Repositorio

- [x] 3.1 Crear `backend/repositories/direccion_repository.py` con métodos: `get_by_id`, `get_by_usuario`, `add`, `delete`, `set_principal` (desactiva todas del usuario y activa la indicada)

## 4. Servicio

- [x] 4.1 Crear `backend/services/direccion_service.py` con funciones: `get_all_by_usuario`, `get_by_id`, `create`, `update`, `delete`, `set_principal`

## 5. Router

- [x] 5.1 Crear `backend/routers/direcciones.py` con los endpoints:
  - `POST /` → crear dirección (201)
  - `GET /` → listar por `?usuario_id=` (200)
  - `GET /{id}` → obtener una (200 / 404)
  - `PUT /{id}` → actualizar (200 / 404)
  - `DELETE /{id}` → eliminar (204 / 404)
  - `PATCH /{id}/principal` → marcar como principal (200 / 404)

## 6. Integración

- [x] 6.1 Importar y registrar `direcciones.router` en `backend/main.py` con `prefix="/api/v1"`
- [x] 6.2 Importar `DireccionRepository` y agregar `self.direcciones: DireccionRepository` al `UnitOfWork` (`backend/uow/unit_of_work.py`)
- [x] 6.3 Agregar seed de `EstadoPedido` y `FormaPago` en `seed_initial_data()` de `backend/services/auth_service.py` (idempotente)

## 7. Verificación

- [x] 7.1 Reconstruir imagen Docker del backend y reiniciar
- [x] 7.2 Verificar `POST /api/v1/direcciones` → 201 con datos válidos
- [x] 7.3 Verificar `GET /api/v1/direcciones?usuario_id=1` → 200 con lista
- [x] 7.4 Verificar `PATCH /api/v1/direcciones/{id}/principal` → 200 y exclusividad de principal
- [x] 7.5 Verificar que las tablas `estados_pedido` y `formas_pago` tienen datos seed correctos
