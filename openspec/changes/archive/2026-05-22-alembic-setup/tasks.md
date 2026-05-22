## 1. Instalación y configuración base

- [x] 1.1 Agregar `alembic==1.13.3` a `backend/requirements.txt`
- [x] 1.2 Correr `alembic init backend/alembic` para generar la estructura de directorios
- [x] 1.3 Configurar `alembic.ini`: reemplazar `sqlalchemy.url` por `%(DATABASE_URL)s` para leerlo desde env

## 2. Configurar env.py de Alembic

- [x] 2.1 En `backend/alembic/env.py`, importar `SQLModel` y todos los modelos desde `backend.models`
- [x] 2.2 Asignar `target_metadata = SQLModel.metadata`
- [x] 2.3 Configurar `get_url()` para leer `DATABASE_URL` desde `os.environ` o `.env`
- [x] 2.4 Asegurar que `run_migrations_online()` usa el engine de SQLModel (no crea uno nuevo)

## 3. Migración inicial

- [x] 3.1 Correr `alembic revision --autogenerate -m "initial_schema"` con la DB en blanco (o usando `--rev-id 0001`)
- [x] 3.2 Revisar el archivo generado: verificar que incluye todas las tablas incluyendo las columnas `stock`, `unidad_medida` y `cantidad_requerida`
- [x] 3.3 Agregar `downgrade()` explícito que hace `drop_table` de todas las tablas en orden inverso (sin FKs colgadas)

## 4. Integrar en el startup de FastAPI

- [x] 4.1 Crear función `run_migrations()` en `backend/database.py` que ejecuta `alembic upgrade head` programáticamente usando `alembic.config.Config` y `command.upgrade`
- [x] 4.2 En `backend/main.py` lifespan, reemplazar `create_db_and_tables()` por `run_migrations()`
- [x] 4.3 Eliminar la función `create_db_and_tables()` y los `ALTER TABLE` hardcodeados de `backend/database.py`

## 5. Verificación y documentación

- [x] 5.1 Levantar el stack con Docker Compose desde cero y verificar que las tablas se crean correctamente vía `alembic upgrade head`
- [x] 5.2 Para ambientes existentes: documentar que hay que correr `alembic stamp head` para evitar re-crear tablas ya existentes
- [x] 5.3 Actualizar `README.md` con los comandos de migración: `upgrade head`, `downgrade -1`, `revision --autogenerate`
