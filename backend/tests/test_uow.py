"""
Tests for UnitOfWork transaction semantics.

Task 8.2: commit on clean exit, data persists.
Task 8.3: rollback on exception, exception propagates.
"""

import pytest
from sqlmodel import SQLModel, Session, create_engine, select

from backend.models.categoria import Categoria
from backend.repositories.categoria_repository import CategoriaRepository
from backend.repositories.factura_repository import FacturaRepository
from backend.repositories.ingrediente_repository import IngredienteRepository
from backend.repositories.pedido_repository import PedidoRepository
from backend.repositories.producto_repository import ProductoRepository
from backend.repositories.refresh_token_repository import RefreshTokenRepository
from backend.repositories.usuario_repository import UsuarioRepository


# ---------------------------------------------------------------------------
# Fixtures — in-memory SQLite engine, isolated per test
# ---------------------------------------------------------------------------

@pytest.fixture(name="sqlite_engine")
def sqlite_engine_fixture():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="StubUoW")
def stub_uow_class(sqlite_engine):
    """Return a UnitOfWork subclass that uses the in-memory engine."""
    from backend.uow.unit_of_work import UnitOfWork

    class TestUoW(UnitOfWork):
        def __enter__(self):
            self.session = Session(sqlite_engine)
            self.categorias = CategoriaRepository(self.session)
            self.facturas = FacturaRepository(self.session)
            self.ingredientes = IngredienteRepository(self.session)
            self.pedidos = PedidoRepository(self.session)
            self.productos = ProductoRepository(self.session)
            self.refresh_tokens = RefreshTokenRepository(self.session)
            self.usuarios = UsuarioRepository(self.session)
            return self

    return TestUoW


# ---------------------------------------------------------------------------
# 8.2  Clean exit → commit, data persists
# ---------------------------------------------------------------------------

def test_uow_commits_on_clean_exit(StubUoW, sqlite_engine):
    """With no exception, __exit__ must commit so data is visible afterwards."""
    with StubUoW() as uow:
        uow.session.add(Categoria(nombre="Test"))

    # After the context manager exits, open a fresh session to verify persistence
    with Session(sqlite_engine) as session:
        result = session.exec(select(Categoria).where(Categoria.nombre == "Test")).first()
    assert result is not None, "Categoria should have been committed to the DB"
    assert result.nombre == "Test"


# ---------------------------------------------------------------------------
# 8.3  Exception inside block → rollback, exception propagates
# ---------------------------------------------------------------------------

def test_uow_rolls_back_on_exception(StubUoW, sqlite_engine):
    """An exception inside the block must cause a rollback and re-raise."""
    class _Boom(RuntimeError):
        pass

    with pytest.raises(_Boom):
        with StubUoW() as uow:
            uow.session.add(Categoria(nombre="ShouldNotExist"))
            raise _Boom("intentional error")

    # Data must NOT have been committed
    with Session(sqlite_engine) as session:
        result = session.exec(
            select(Categoria).where(Categoria.nombre == "ShouldNotExist")
        ).first()
    assert result is None, "Categoria should NOT be in DB after rollback"
