from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from backend.models.pedido import Pedido


class Rol(SQLModel, table=True):
    __tablename__ = "roles"

    codigo: str = Field(max_length=20, primary_key=True)
    descripcion: Optional[str] = None


class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=200)
    email: str = Field(max_length=200, unique=True, index=True)
    password_hash: str = Field(max_length=200)
    telefono: Optional[str] = Field(default=None, max_length=50)

    creado_en: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    actualizado_en: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    eliminado_en: Optional[datetime] = None

    pedidos: list["Pedido"] = Relationship(back_populates="usuario")


class UsuarioRol(SQLModel, table=True):
    __tablename__ = "usuario_roles"

    usuario_id: int = Field(foreign_key="usuarios.id", primary_key=True)
    rol_codigo: str = Field(max_length=20, foreign_key="roles.codigo", primary_key=True)
