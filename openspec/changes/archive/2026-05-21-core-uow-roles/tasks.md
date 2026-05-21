## 1. Modelo de dominio: Rol semántico

- [x] 1.1 En `backend/models/usuario.py`, cambiar `Rol`: reemplazar `id: Optional[int]` (PK autoincremental) por `codigo: str = Field(max_length=20, primary_key=True)`
- [x] 1.2 Eliminar el campo `nombre` de `Rol` (sus valores pasan a vivir en `codigo`); conservar `descripcion: Optional[str]`
- [x] 1.3 En `backend/models/usuario.py`, cambiar `UsuarioRol`: reemplazar `rol_id: int = Field(foreign_key="roles.id", primary_key=True)` por `rol_codigo: str = Field(max_length=20, foreign_key="roles.codigo", primary_key=True)`
- [x] 1.4 Verificar que la PK compuesta de `UsuarioRol` queda `(usuario_id, rol_codigo)`

## 2. Repositorio: consultas de roles por código

- [x] 2.1 En `backend/repositories/usuario_repository.py`, actualizar `get_roles`: cambiar el join a `UsuarioRol.rol_codigo == Rol.codigo`
- [x] 2.2 Cambiar el `select(Rol.nombre)` por `select(Rol.codigo)` para que el contrato siga devolviendo `list[str]` con los códigos de rol

## 3. Unit of Work: transacciones atómicas

- [x] 3.1 En `backend/uow/unit_of_work.py`, modificar `__exit__`: confirmar (`self.session.commit()`) cuando `exc_type is None`, revertir (`self.session.rollback()`) en caso contrario
- [x] 3.2 Asegurar que `self.session.close()` se ejecuta en ambos caminos y que `__exit__` retorna `False` (no suprime la excepción)
- [x] 3.3 Eliminar el método público `commit()` de `UnitOfWork`

## 4. Seed de roles por código

- [x] 4.1 En `auth_service.seed_initial_data`, actualizar `ROLES_FIJOS` y la creación de roles para usar `codigo` (`Rol(codigo=..., descripcion=...)`) en vez de `nombre`
- [x] 4.2 Construir `roles_map` sobre `codigo` y asociar usuarios con `UsuarioRol(usuario_id=..., rol_codigo=...)`
- [x] 4.3 Reemplazar la búsqueda de roles `Rol.nombre == ...` por `Rol.codigo == ...` y mantener la idempotencia (no duplicar roles ni asociaciones)
- [x] 4.4 Si `backend/seed.py` referencia roles, alinearlo con el modelo semántico (`codigo`); de lo contrario, confirmar que solo siembra categorías/ingredientes/productos y no requiere cambios de rol

## 5. Servicios: eliminar commits manuales

- [x] 5.1 `backend/services/auth_service.py`: eliminar las 4 llamadas `uow.commit()` (login, register, refresh, logout)
- [x] 5.2 `backend/services/categoria_service.py`: eliminar las 3 llamadas `uow.commit()`
- [x] 5.3 `backend/services/producto_service.py`: eliminar las 6 llamadas `uow.commit()`
- [x] 5.4 `backend/services/ingrediente_service.py`: eliminar las 3 llamadas `uow.commit()`
- [x] 5.5 `backend/services/pedido_service.py`: eliminar la llamada `uow.commit()`
- [x] 5.6 `backend/services/factura_service.py`: eliminar la llamada `uow.commit()`
- [x] 5.7 `backend/services/mercadopago_service.py`: eliminar las 3 llamadas `uow.commit()`
- [x] 5.8 Verificar que `auth_service.register` sigue usando `uow.session.flush()` (no commit) para obtener `usuario.id` antes de crear el `UsuarioRol`

## 6. Registro: asignación de rol CLIENT por código

- [x] 6.1 En `auth_service.register`, cambiar la búsqueda `select(Rol).where(Rol.nombre == "CLIENT")` por `Rol.codigo == "CLIENT"` (o asignar el código directo)
- [x] 6.2 Crear la asociación como `UsuarioRol(usuario_id=usuario.id, rol_codigo="CLIENT")`

## 7. Verificación de RBAC y end-to-end

- [x] 7.1 Confirmar que `require_role` en `backend/dependencies/auth.py` funciona sin cambios (compara códigos de rol como strings)
- [x] 7.2 Verificar el flujo JWT: `crear_access_token` recibe los códigos de rol desde `get_roles` y el payload los incluye
- [ ] 7.3 Recrear el esquema de roles (drop/recreate `roles` y `usuario_roles` o borrar la BD de dev) y ejecutar `seed_initial_data()`
- [ ] 7.4 Probar login del admin y de un cliente; verificar que los roles devueltos son los códigos correctos y que los endpoints protegidos autorizan/deniegan según corresponda

## 8. Tests

- [x] 8.1 Actualizar fixtures/tests existentes que usen `Rol.id`, `Rol.nombre` o `UsuarioRol.rol_id` para usar `codigo`/`rol_codigo`
- [x] 8.2 Agregar test de UoW: el bloque `with` sin excepción confirma y los datos persisten
- [x] 8.3 Agregar test de UoW: una excepción dentro del bloque revierte los cambios y la excepción se propaga (no se suprime)
- [x] 8.4 Agregar/ajustar test de roles: registro asigna `CLIENT`, `get_roles` devuelve códigos, y un endpoint con `require_role` autoriza correctamente
