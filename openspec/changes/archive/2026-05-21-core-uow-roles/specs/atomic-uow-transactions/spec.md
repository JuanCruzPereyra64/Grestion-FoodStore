## ADDED Requirements

### Requirement: UoW confirma automáticamente en salida limpia

El `UnitOfWork`, usado como context manager, SHALL ejecutar `commit()` sobre su `Session` cuando el bloque `with` finaliza sin que se haya propagado ninguna excepción. La confirmación SHALL ocurrir dentro de `__exit__`, sin requerir ninguna llamada explícita por parte del código cliente.

#### Scenario: Bloque with finaliza sin excepción

- **WHEN** se abre `with UnitOfWork() as uow:`, se agregan o modifican entidades a través de los repositorios y el bloque termina sin lanzar excepción
- **THEN** la transacción se confirma automáticamente en `__exit__`
- **AND** los cambios persisten en la base de datos al cerrar la sesión
- **AND** el código cliente NO necesita llamar a ningún método de confirmación

#### Scenario: La sesión se cierra siempre

- **WHEN** un bloque `with UnitOfWork() as uow:` finaliza, tanto en salida limpia como con excepción
- **THEN** `__exit__` llama a `session.close()` en ambos caminos
- **AND** la conexión queda liberada

### Requirement: UoW revierte y propaga ante excepción

El `UnitOfWork` SHALL ejecutar `rollback()` sobre su `Session` cuando se propaga una excepción dentro del bloque `with`, y NO SHALL suprimir dicha excepción (`__exit__` retorna un valor falsy).

#### Scenario: Excepción dentro del bloque

- **WHEN** se lanza una excepción dentro de `with UnitOfWork() as uow:` después de haber agregado o modificado entidades
- **THEN** la transacción se revierte (`rollback`) en `__exit__`
- **AND** ningún cambio realizado dentro del bloque persiste en la base de datos

#### Scenario: La excepción se propaga al llamador

- **WHEN** ocurre una excepción dentro del bloque `with` (por ejemplo, un `HTTPException` lanzado por un servicio)
- **THEN** `__exit__` retorna `False` (no suprime la excepción)
- **AND** la excepción se propaga al código que abrió el `with`

### Requirement: Los servicios no confirman la transacción directamente

Los servicios de `backend/services/` SHALL delegar la confirmación de la transacción al ciclo de vida del `UnitOfWork` y NO SHALL invocar `uow.commit()` ni `uow.session.commit()` directamente. El método público `commit()` SHALL ser eliminado del `UnitOfWork`.

#### Scenario: Servicio persiste datos sin commit manual

- **WHEN** un servicio (auth, categoría, producto, ingrediente, pedido, factura o mercadopago) crea o actualiza entidades dentro de un `with UnitOfWork() as uow:`
- **THEN** el servicio NO contiene ninguna llamada a `uow.commit()`
- **AND** los datos se persisten igualmente al cerrar el bloque limpiamente

#### Scenario: Servicio necesita un ID generado antes de seguir

- **WHEN** un servicio necesita la clave primaria autogenerada de una entidad recién creada para construir una relación dentro del mismo bloque
- **THEN** usa `uow.session.flush()` para asignar la PK sin confirmar la transacción
- **AND** NO usa `commit()` para ese propósito

#### Scenario: El UoW no expone método commit público

- **WHEN** se inspecciona la clase `UnitOfWork`
- **THEN** no existe un método público `commit()`
- **AND** cualquier confirmación ocurre únicamente en `__exit__`
