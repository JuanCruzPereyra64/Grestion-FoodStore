import os
from pathlib import Path
from typing import Generator
from dotenv import load_dotenv
from sqlmodel import Session, create_engine

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)


def run_migrations() -> None:
    from alembic.config import Config
    from alembic import command

    alembic_cfg = Config(str(Path(__file__).parent / "alembic.ini"))
    alembic_cfg.set_main_option("sqlalchemy.url", DATABASE_URL)
    alembic_cfg.set_main_option("script_location", str(Path(__file__).parent / "alembic"))
    command.upgrade(alembic_cfg, "head")


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def get_uow():
    from backend.uow.unit_of_work import UnitOfWork
    with UnitOfWork() as uow:
        yield uow
