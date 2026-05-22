## Why

El proyecto usa `SQLModel.metadata.create_all(engine)` para crear tablas, lo que funciona solo cuando la base de datos está vacía. Sin un sistema de migraciones, cualquier cambio al schema en producción requiere SQL manual y no puede revertirse de forma controlada.

## What Changes

- Instalar `alembic` como dependencia del backend
- Inicializar Alembic en `backend/alembic/` con configuración apuntando a la DB de SQLModel
- Crear migración inicial que captura el schema actual (todas las tablas existentes)
- Adaptar `backend/main.py` para correr `alembic upgrade head` al iniciar en lugar de `create_all`
- Agregar instrucciones en `README.md` para correr migraciones en desarrollo y producción

## Capabilities

### New Capabilities
- `database-migrations`: Sistema versionado de migraciones con Alembic — crear, aplicar y revertir cambios de schema de forma reproducible en todos los ambientes

### Modified Capabilities
- `atomic-uow-transactions`: El setup de la DB cambia de `create_all` a `alembic upgrade head` — el contrato de transacciones no cambia, pero el bootstrap de la DB sí

## Impact

- **Backend**: `backend/requirements.txt`, `backend/main.py`, nuevo directorio `backend/alembic/`
- **DB**: Schema existente capturado en migración inicial `0001_initial_schema.py`
- **Docker**: El servicio backend necesita correr `alembic upgrade head` antes de iniciar uvicorn
- **Sin breaking changes en API**: Ningún endpoint cambia
