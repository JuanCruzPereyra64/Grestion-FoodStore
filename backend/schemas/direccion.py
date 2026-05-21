from typing import Optional
from sqlmodel import SQLModel


class DireccionCreate(SQLModel):
    usuario_id: int
    alias: str
    linea1: str
    ciudad: str
    cp: str
    es_principal: bool = False


class DireccionUpdate(SQLModel):
    alias: Optional[str] = None
    linea1: Optional[str] = None
    ciudad: Optional[str] = None
    cp: Optional[str] = None


class DireccionRead(SQLModel):
    id: int
    usuario_id: int
    alias: str
    linea1: str
    ciudad: str
    cp: str
    es_principal: bool
