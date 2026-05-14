from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class PedidoItem(SQLModel):
    producto_id: int
    cantidad: int = Field(ge=1)
    excluded_ingrediente_ids: list[int] = Field(default=[])


class PedidoCreate(SQLModel):
    cliente_nombre: str = Field(min_length=1, max_length=200)
    direccion: str = Field(min_length=1)
    items: list[PedidoItem] = Field(min_length=1)


class PedidoDetalleRead(SQLModel):
    id: int
    producto_id: int
    producto_nombre_snapshot: str
    precio_unitario_snapshot: float
    cantidad: int
    subtotal: float
    personalizacion: list[int]


class PedidoRead(SQLModel):
    id: int
    cliente_nombre: str
    direccion_snapshot: str
    total: float
    created_at: datetime
    detalles: list[PedidoDetalleRead]
