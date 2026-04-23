from typing import Optional
from sqlmodel import SQLModel


class IngredienteCreate(SQLModel):
    nombre: str
    unidad_medida: str


class IngredienteUpdate(SQLModel):
    nombre: Optional[str] = None
    unidad_medida: Optional[str] = None


class IngredienteRead(SQLModel):
    id: int
    nombre: str
    unidad_medida: str
