from typing import Optional
from sqlmodel import SQLModel


class IngredienteCreate(SQLModel):
    nombre: str
    descripcion: Optional[str] = None
    es_alergeno: bool = False
    stock: float = 0.0
    unidad_medida: str = "unidad"


class IngredienteUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    es_alergeno: Optional[bool] = None
    stock: Optional[float] = None
    unidad_medida: Optional[str] = None


class IngredienteRead(SQLModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    es_alergeno: bool
    stock: float
    unidad_medida: str
