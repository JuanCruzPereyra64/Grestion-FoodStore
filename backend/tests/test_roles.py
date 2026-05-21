"""
Tests for role semantics with the new `codigo`-based Rol model.

Task 8.4:
  - register assigns CLIENT role
  - get_roles returns codes (not names)
  - require_role authorises correctly based on JWT codes
"""

import pytest
from sqlmodel import SQLModel, Session, create_engine, select

from backend.models.usuario import Rol, Usuario, UsuarioRol
from backend.repositories.categoria_repository import CategoriaRepository
from backend.repositories.factura_repository import FacturaRepository
from backend.repositories.ingrediente_repository import IngredienteRepository
from backend.repositories.pedido_repository import PedidoRepository
from backend.repositories.producto_repository import ProductoRepository
from backend.repositories.refresh_token_repository import RefreshTokenRepository
from backend.repositories.usuario_repository import UsuarioRepository


# ---------------------------------------------------------------------------
# Fixtures — in-memory SQLite engine
# ---------------------------------------------------------------------------

@pytest.fixture(name="sqlite_engine")
def sqlite_engine_fixture():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="StubUoW")
def stub_uow_class(sqlite_engine):
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


@pytest.fixture(name="seeded_engine")
def seeded_engine_fixture(sqlite_engine):
    """Seed roles CLIENT and ADMIN into the in-memory DB."""
    with Session(sqlite_engine) as session:
        session.add(Rol(codigo="CLIENT", descripcion="Cliente de la tienda"))
        session.add(Rol(codigo="ADMIN", descripcion="Acceso total al sistema"))
        session.commit()
    return sqlite_engine


# ---------------------------------------------------------------------------
# 8.4a  get_roles returns codes
# ---------------------------------------------------------------------------

def test_get_roles_returns_codes(seeded_engine, StubUoW):
    """UsuarioRepository.get_roles must return role codes (strings)."""
    # Manually insert a user + role association
    with Session(seeded_engine) as session:
        usuario = Usuario(
            nombre="Pepe",
            email="pepe@example.com",
            password_hash="x",
        )
        session.add(usuario)
        session.flush()
        session.add(UsuarioRol(usuario_id=usuario.id, rol_codigo="CLIENT"))
        session.commit()
        usuario_id = usuario.id

    with StubUoW.__wrapped__(seeded_engine) if hasattr(StubUoW, "__wrapped__") else _open_stub(StubUoW) as uow:
        roles = uow.usuarios.get_roles(usuario_id)

    assert roles == ["CLIENT"], f"Expected ['CLIENT'], got {roles}"


def _open_stub(StubUoWClass):
    """Helper to instantiate the stub UoW via context manager."""
    return StubUoWClass()


# ---------------------------------------------------------------------------
# 8.4b  register assigns CLIENT automatically
# ---------------------------------------------------------------------------

def test_register_assigns_client_role(seeded_engine):
    """AuthService.register must create a UsuarioRol with rol_codigo='CLIENT'."""
    from backend.uow.unit_of_work import UnitOfWork
    from backend.schemas.auth import RegisterRequest

    class TestUoW(UnitOfWork):
        def __enter__(self):
            self.session = Session(seeded_engine)
            self.categorias = CategoriaRepository(self.session)
            self.facturas = FacturaRepository(self.session)
            self.ingredientes = IngredienteRepository(self.session)
            self.pedidos = PedidoRepository(self.session)
            self.productos = ProductoRepository(self.session)
            self.refresh_tokens = RefreshTokenRepository(self.session)
            self.usuarios = UsuarioRepository(self.session)
            return self

    from backend.services.auth_service import AuthService

    data = RegisterRequest(
        nombre="Nueva Persona",
        email="nueva@example.com",
        password="segura123",
    )

    with TestUoW() as uow:
        response = AuthService.register(uow, data)

    assert "CLIENT" in response.user.roles, (
        f"Expected CLIENT in roles after register, got {response.user.roles}"
    )


# ---------------------------------------------------------------------------
# 8.4c  require_role checks codes in JWT payload
# ---------------------------------------------------------------------------

def test_crear_access_token_includes_roles():
    """crear_access_token encodes roles into the JWT; decoded payload has them."""
    from backend.dependencies.auth import crear_access_token, decodificar_token

    token = crear_access_token(usuario_id=1, email="a@b.com", roles=["ADMIN", "STOCK"])
    payload = decodificar_token(token)

    assert payload["roles"] == ["ADMIN", "STOCK"], (
        f"Expected ['ADMIN', 'STOCK'] in token payload, got {payload['roles']}"
    )
