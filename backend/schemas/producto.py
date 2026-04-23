from typing import Optional
from sqlmodel import SQLModel, Field
from backend.schemas.categoria import CategoriaRead
from backend.schemas.ingrediente import IngredienteRead


class ProductoCreate(SQLModel):
    nombre: str
    precio: float
    descripcion: Optional[str] = None
    categoria_id: int
    ingrediente_ids: list[int] = Field(min_length=1)


class ProductoUpdate(SQLModel):
    nombre: Optional[str] = None
    precio: Optional[float] = None
    descripcion: Optional[str] = None
    categoria_id: Optional[int] = None
    ingrediente_ids: Optional[list[int]] = None


class ProductoRead(SQLModel):
    id: int
    nombre: str
    precio: float
    descripcion: Optional[str] = None
    categoria_id: int
    categoria: Optional[CategoriaRead] = None
    ingredientes: list[IngredienteRead] = []
