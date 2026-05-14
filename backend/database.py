import os
from typing import Generator
from dotenv import load_dotenv
from sqlmodel import SQLModel, Session, create_engine

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

    # Migraciones manuales para columnas nuevas en tablas existentes
    from sqlmodel import text
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE ingredientes ADD COLUMN IF NOT EXISTS stock FLOAT DEFAULT 0.0"))
        conn.execute(text("ALTER TABLE ingredientes ADD COLUMN IF NOT EXISTS unidad_medida VARCHAR DEFAULT 'unidad'"))
        conn.execute(text("ALTER TABLE producto_ingrediente ADD COLUMN IF NOT EXISTS cantidad_requerida FLOAT DEFAULT 1.0"))
        conn.commit()


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

def get_uow():
    from backend.uow.unit_of_work import UnitOfWork
    with UnitOfWork() as uow:
        yield uow
