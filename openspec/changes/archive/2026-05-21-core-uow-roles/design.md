## Context

El proyecto FoodStore usa el patrón **Unit of Work (UoW)** como context manager (`with UnitOfWork() as uow:`) para agrupar repositorios y compartir una única `Session` de SQLModel por request. Hoy el `__exit__` solo hace `rollback()` ante excepción y `close()` siempre, pero **nunca confirma** la transacción al salir limpiamente. Por eso cada servicio debe llamar `uow.commit()` manualmente. Esto acopla la lógica de negocio a la confirmación física, es fácil de olvidar (genera datos que parecen guardados pero se pierden al cerrar la sesión) y dispersa la responsabilidad transaccional por 7 archivos de servicio.

En paralelo, la entidad de dominio `Rol` (`backend/models/usuario.py`) usa una PK numérica autoincremental (`id: int`) más un campo `nombre: str` único. La pivot `UsuarioRol` referencia `roles.id`. Los roles del sistema son un conjunto **fijo y semántico** (`ADMIN`, `STOCK`, `PEDIDOS`, `CLIENT`) que se siembra en cada entorno. Usar IDs arbitrarios de BD para identificar conceptos de dominio inmutables produce IDs distintos entre entornos (dev/test/prod), búsquedas indirectas (`Rol.nombre == "CLIENT"` → `rol.id` → FK) y acoplamiento innecesario.

**Constraints:**
- Stack: FastAPI + SQLModel/SQLAlchemy + SQLite/MySQL. Backend en `backend/`.
- El JWT y `require_role` ya operan sobre **strings de rol** (`list[str]`), no sobre IDs: el cambio a PK semántica los acerca al modelo real.
- No hay framework de migraciones formal: el esquema se crea con `create_all` y se puebla con `seed.py` / `seed_initial_data()`. Por eso "migrar" aquí implica recrear el esquema de roles, no un `ALTER TABLE` versionado.

## Goals / Non-Goals

**Goals:**
- `UnitOfWork.__exit__` confirma (`commit`) automáticamente cuando el bloque `with` finaliza sin excepción.
- Ante cualquier excepción dentro del bloque, la transacción se revierte (`rollback`) y la excepción se propaga (no se suprime).
- Los servicios dejan de llamar `commit()` manualmente; la atomicidad la gobierna el ciclo de vida del context manager.
- `Rol` usa una PK semántica `codigo: str` (VARCHAR(20)) con valores `ADMIN`, `STOCK`, `PEDIDOS`, `CLIENT`.
- `UsuarioRol` referencia `roles.codigo` vía `rol_codigo: str` en lugar de `rol_id: int`.
- `seed.py` / `seed_initial_data()` insertan roles por `codigo` y asocian usuarios por `codigo`.

**Non-Goals:**
- No se introduce un sistema de migraciones (Alembic) en este change.
- No se modifican los permisos de los endpoints ni la lógica de `require_role` (sigue comparando strings).
- No se rediseña el modelo de permisos granular (acción/recurso); seguimos con RBAC por rol.
- No se cambia la PK de `Usuario` (sigue `id` numérico autoincremental).

## Decisions

### 1. `__exit__` confirma en salida limpia y propaga excepciones

```python
def __exit__(self, exc_type, exc_val, exc_tb):
    if exc_type is None:
        self.session.commit()
    else:
        self.session.rollback()
    self.session.close()
    return False
```

- **`return False` explícito**: indica que el context manager **no suprime** la excepción. Si se omitiera (retorno `None`, también falsy) el comportamiento sería el mismo, pero declararlo es intención explícita y evita que un futuro refactor lo cambie por accidente.
- **`commit` solo si `exc_type is None`**: salida limpia confirma; cualquier excepción revierte.
- **`close()` siempre**: en `finally`-equivalente, libera la conexión en ambos caminos.
- **Alternativa descartada**: dejar `commit()` manual y solo documentarlo. Rechazada: el bug recurrente es justamente olvidar el commit; la solución debe ser estructural, no documental.

### 2. Eliminar el método público `commit()` del UoW

Se **elimina** `UnitOfWork.commit()`. Razones:
- Su existencia invita a llamarlo manualmente, lo que rompe la garantía de atomicidad del context manager (un `commit()` a mitad de bloque parte la transacción en dos).
- Si algún servicio necesita persistir IDs autogenerados antes de seguir (caso `register`, que usa `usuario.id` para la FK), debe usar `uow.session.flush()` —que asigna PKs sin cerrar la transacción— no `commit()`.
- **Alternativa descartada**: marcar `commit()` como deprecated y mantenerlo. Rechazada: el conjunto de llamadas es acotado (todas en `backend/services/`) y se migran en este mismo change, así que no hace falta período de gracia.

### 3. `codigo` como PRIMARY KEY VARCHAR(20), no UNIQUE sobre `id`

```python
class Rol(SQLModel, table=True):
    __tablename__ = "roles"
    codigo: str = Field(max_length=20, primary_key=True)
    descripcion: Optional[str] = None
```

- `codigo` es la **PK real** (no un índice único sobre una PK numérica). Esto elimina el `id` y hace que la FK de la pivot apunte a un valor de dominio estable.
- **Se elimina el campo `nombre`**. Hoy `nombre` contenía exactamente los valores `ADMIN`/`STOCK`/... que ahora viven en `codigo`. Mantener ambos sería redundante. La descripción legible se conserva en `descripcion`. (Si en el futuro se quiere un display name distinto del código, se reintroduce un campo `nombre` no-PK; por ahora YAGNI.)
- **Alternativa descartada**: mantener `id` numérico y agregar `codigo` UNIQUE. Rechazada: no resuelve el acoplamiento (la FK seguiría sobre `id`) y deja dos claves para el mismo concepto.

### 4. `UsuarioRol.rol_codigo: str` FK → `roles.codigo`

```python
class UsuarioRol(SQLModel, table=True):
    __tablename__ = "usuario_roles"
    usuario_id: int = Field(foreign_key="usuarios.id", primary_key=True)
    rol_codigo: str = Field(max_length=20, foreign_key="roles.codigo", primary_key=True)
```

- PK compuesta `(usuario_id, rol_codigo)`. Tipos de la FK alineados con la nueva PK de `roles`.

### 5. Búsqueda de roles por `codigo`

- `auth_service.register`: `select(Rol).where(Rol.codigo == "CLIENT")` y `UsuarioRol(usuario_id=..., rol_codigo="CLIENT")` (puede asignarse el código directo sin buscar el objeto, ya que es la PK).
- `usuario_repository.get_roles`: el `join` pasa de `UsuarioRol.rol_id == Rol.id` a `UsuarioRol.rol_codigo == Rol.codigo`, y selecciona `Rol.codigo` en vez de `Rol.nombre` (el contrato de salida sigue siendo `list[str]` con los códigos, que es lo que el JWT y `require_role` ya esperan).
- `seed_initial_data`: el `roles_map` se construye sobre `codigo`; las asociaciones usan `rol_codigo`.

### 6. Rollback sin cambios en servicios

`require_role` y los servicios **no necesitan tocar el manejo de errores**: si lanzan `HTTPException` u otra excepción dentro del `with`, el nuevo `__exit__` revierte automáticamente. Esto ya era el comportamiento previo para el rollback; lo nuevo es solo el commit automático.

## Risks / Trade-offs

- **[Datos de roles existentes en una BD ya creada quedan huérfanos]** → El esquema de `roles`/`usuario_roles` cambia de forma incompatible (PK numérica → VARCHAR). Mitigación: como no hay migraciones versionadas y los roles son datos sembrados, la BD de roles se recrea vía seed. En entornos con datos reales habría que dropear y resembrar `roles`/`usuario_roles` (documentado en Migration Plan).
- **[Un servicio que dependía de commit parcial a mitad de bloque cambia de comportamiento]** → Tras eliminar `commit()`, lo que antes se persistía a mitad ahora se confirma todo junto al final. Mitigación: revisar que ningún flujo lea de BD un dato que él mismo escribió y aún no flusheó; donde haga falta el ID generado, usar `flush()` (ya aplicado en `register`).
- **[`return False` mal interpretado]** → Si alguien lo cambia a `True`, las excepciones se tragarían silenciosamente. Mitigación: comentario en el código y scenario de spec que exige propagación de la excepción.
- **[Tests acoplados a `id` numérico de Rol o a `Rol.nombre`]** → Pueden romper. Mitigación: actualizar fixtures/tests a `codigo` como parte de las tasks.

## Migration Plan

Orden de cambios (de modelo hacia afuera, para que cada paso compile sobre el anterior):

1. **Modelo** (`backend/models/usuario.py`): `Rol.codigo` PK + remover `id`/`nombre`; `UsuarioRol.rol_codigo` FK.
2. **Repositorio** (`backend/repositories/usuario_repository.py`): `get_roles` join por `codigo`, select `Rol.codigo`.
3. **UoW** (`backend/uow/unit_of_work.py`): auto-commit en `__exit__`, eliminar `commit()`.
4. **Seed** (`backend/seed.py` y `auth_service.seed_initial_data`): insertar roles por `codigo`, asociar por `rol_codigo`.
5. **Servicios**: eliminar todas las llamadas `uow.commit()` (auth, categoria, producto, ingrediente, pedido, factura, mercadopago) y los `session.commit()` directos donde corresponda al flujo UoW.
6. **Tests**: actualizar fixtures de roles a `codigo`; agregar/ajustar tests de UoW (commit en salida limpia, rollback en excepción).

**Recreación de esquema (BD existente):** dropear tablas `usuario_roles` y `roles`, recrear con `create_all`, ejecutar `seed_initial_data()`. En dev/test basta con borrar el archivo SQLite y resembrar.

**Rollback strategy:** revertir el commit de git restaura el modelo y el UoW previos; recrear el esquema de roles con el seed anterior. Como no hay migraciones versionadas, el rollback es a nivel de código + reseed.

## Open Questions

- ¿Se requiere un display name legible distinto del `codigo` en la UI de administración? Si sí, reintroducir `nombre` no-PK en un change posterior (hoy YAGNI).
- ¿Hay entornos con datos reales en `usuario_roles` que requieran un script de migración de datos en vez de reseed? Asumimos que no (roles sembrados).
