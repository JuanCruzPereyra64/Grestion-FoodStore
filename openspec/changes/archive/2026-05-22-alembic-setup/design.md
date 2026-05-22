## Context

El backend usa `SQLModel.metadata.create_all(engine)` para inicializar la DB. El problema ya se evidenció: `database.py` tiene 3 `ALTER TABLE` hardcodeados para columnas (`stock`, `unidad_medida`, `cantidad_requerida`) que se agregaron después de la creación inicial. Eso es una migración manual — frágil, no versionada, y no reversible.

Con Alembic, cada cambio al schema se convierte en un archivo Python versionado en Git, reproducible en cualquier ambiente, y revertible con un comando.

## Goals / Non-Goals

**Goals:**
- Instalar y configurar Alembic integrado con SQLModel y el engine existente
- Crear migración inicial `0001` que captura el schema completo actual (incluyendo las columnas manuales)
- Reemplazar `create_all` + `ALTER TABLE` hardcodeados por `alembic upgrade head`
- Workflow claro para crear nuevas migraciones en el futuro

**Non-Goals:**
- No cambiar ningún modelo de datos existente
- No cambiar ningún endpoint de la API
- No configurar migraciones automáticas en CI/CD (eso es infraestructura fuera del scope)

## Decisions

### D1: Alembic con autogenerate basado en SQLModel metadata

**Decisión**: Usar `target_metadata = SQLModel.metadata` en `env.py` para que `alembic revision --autogenerate` detecte diferencias automáticamente.

**Alternativa descartada**: Escribir cada migración a mano. Más control, pero innecesariamente tedioso para el schema inicial que ya existe.

**Razón**: SQLModel expone `metadata` compatible con SQLAlchemy, por lo que autogenerate funciona out-of-the-box. Solo hay que importar todos los modelos antes de que Alembic los detecte.

---

### D2: Migración inicial como snapshot, no como script generado

**Decisión**: La migración `0001_initial_schema` se genera con `--autogenerate` comparando contra una DB vacía, lo que produce el DDL completo. Los `ALTER TABLE` manuales se eliminan de `database.py`.

**Razón**: Una sola fuente de verdad. Si alguien levanta el proyecto desde cero, `alembic upgrade head` crea TODO el schema correctamente, incluyendo las columnas que antes se agregaban con SQL hardcodeado.

---

### D3: `alembic upgrade head` en el lifespan de FastAPI, no en Docker entrypoint

**Decisión**: Correr `alembic upgrade head` dentro del `lifespan` de FastAPI (en `main.py`), reemplazando la llamada a `create_db_and_tables()`.

**Alternativa descartada**: Correr en el `command` del servicio Docker (`alembic upgrade head && uvicorn ...`). Más correcto en producción real, pero agrega complejidad al docker-compose sin beneficio real para este proyecto UTN.

**Razón**: Más simple, funciona igual para desarrollo y producción del scope actual.

---

### D4: Convención de nombres de versión `NNNN_descripcion`

**Decisión**: Archivos de migración con prefijo numérico de 4 dígitos: `0001_initial_schema.py`, `0002_add_X.py`.

**Razón**: Orden lexicográfico natural. Alembic ya maneja el encadenamiento por `down_revision`, pero el nombre descriptivo facilita el review en Git.

## Risks / Trade-offs

- **[Riesgo] DB existente ya tiene el schema** → Alembic va a querer aplicar la migración 0001 sobre una DB que ya tiene las tablas. Mitigación: usar `alembic stamp head` en ambientes existentes para marcar la DB como "ya en este estado" sin correr el DDL.

- **[Trade-off] Autogenerate no detecta todo** → Alembic no autogenera índices sobre expresiones, constraints customizados, o secuencias Postgres custom. Para este proyecto no hay ninguno de esos, así que el riesgo es nulo.

- **[Riesgo] Importar todos los modelos en env.py** → Si falta importar un modelo, Alembic no lo detecta y no lo incluye en autogenerate. Mitigación: importar el `__init__` de `backend/models/` que ya reexporta todos los modelos.

## Migration Plan

1. Instalar `alembic` en `requirements.txt`
2. Correr `alembic init backend/alembic` para generar la estructura
3. Configurar `alembic.ini` con `sqlalchemy.url` apuntando a `%(DATABASE_URL)s`
4. Configurar `backend/alembic/env.py` para usar `SQLModel.metadata` e importar todos los modelos
5. Generar migración inicial: `alembic revision --autogenerate -m "initial_schema"`
6. Revisar el archivo generado y confirmar que incluye todas las tablas + las columnas manuales
7. Reemplazar `create_db_and_tables()` en `main.py` por `run_migrations()`
8. Limpiar los `ALTER TABLE` hardcodeados de `database.py`
9. Para ambientes existentes: `alembic stamp head` (no re-crea tablas, solo registra el estado)

**Rollback**: `alembic downgrade -1`. La migración 0001 tiene `drop_table` en su `downgrade()`.
