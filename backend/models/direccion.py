from typing import Optional
from sqlmodel import Field, SQLModel


class DireccionEntrega(SQLModel, table=True):
    __tablename__ = "direcciones_entrega"

    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuarios.id")
    alias: str = Field(max_length=100)
    linea1: str = Field(max_length=300)
    ciudad: str = Field(max_length=100)
    cp: str = Field(max_length=20)
    es_principal: bool = Field(default=False)
