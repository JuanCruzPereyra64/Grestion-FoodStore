from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel


class Rol(SQLModel, table=True):
    __tablename__ = "roles"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=50, unique=True, index=True)
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


class UsuarioRol(SQLModel, table=True):
    __tablename__ = "usuario_roles"

    usuario_id: int = Field(foreign_key="usuarios.id", primary_key=True)
    rol_id: int = Field(foreign_key="roles.id", primary_key=True)
