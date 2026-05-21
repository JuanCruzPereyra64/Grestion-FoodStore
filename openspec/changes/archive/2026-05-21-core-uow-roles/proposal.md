## Why

La implementación actual del `UnitOfWork` no realiza el `commit()` automático de las transacciones al salir exitosamente del bloque de contexto (`with`). Como consecuencia, los servicios se ven forzados a llamar manualmente a `uow.commit()`, acoplando la lógica de negocio a la confirmación física de la transacción.

Además, la entidad `Rol` utiliza una clave primaria numérica autoincremental (`id`) en lugar de una clave primaria semántica (`codigo`) como exige la especificación técnica para la gestión de permisos en RBAC. Esto genera acoplamiento e inconsistencia de IDs entre diferentes entornos.

## What Changes

- **Backend — Unit of Work**: Modificar `UnitOfWork.__exit__` para ejecutar `self.commit()` si la ejecución del bloque finaliza sin excepciones.
- **Backend — Modelo Rol**: Reemplazar el campo numérico autoincremental `id` de `Rol` por un campo `codigo` (VARCHAR(20)) como clave primaria semántica (valores: `ADMIN`, `STOCK`, `PEDIDOS`, `CLIENT`).
- **Backend — Pivot UsuarioRol**: Modificar la clave primaria compuesta para pivotar sobre `usuario_id` (BIGINT) y `rol_codigo` (VARCHAR(20)).
- **Backend — Seed Data**: Actualizar el archivo `seed.py` para insertar los roles con su clave semántica y asociar el usuario administrador adecuadamente.
- **Backend — Servicios**: Remover las llamadas directas a `uow.commit()` en los servicios (comenzando por `auth_service.py` y `pedido_service.py` cuando se interactúe con ellos) y actualizar la búsqueda de roles.

## Capabilities

### New Capabilities
- `atomic-uow-transactions`: Persistencia atómica de transacciones gestionada por el ciclo de vida del bloque del context manager en la capa UoW.
- `semantic-roles-rbac`: Identificación de roles a través de claves de dominio semánticas inmutables en lugar de IDs arbitrarios de BD.

## Impact

| Area | Impact | Description |
|------|--------|-------------|
| `backend/uow/unit_of_work.py` | High | Automatizar transacciones en `__exit__` y limpiar métodos manuales |
| `backend/models/usuario.py` | High | Modificar tablas `roles` y `usuario_roles` para usar clave semántica `codigo` |
| `backend/seed.py` | Medium | Actualizar semillas iniciales de roles y usuario admin |
| `backend/services/auth_service.py` | Medium | Adaptar flujos de login y registro a roles semánticos y remover commits manuales |
