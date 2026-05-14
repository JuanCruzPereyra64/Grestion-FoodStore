from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class FacturaCreate(SQLModel):
    cuit_cliente: Optional[str] = Field(default=None, max_length=20)
    tipo_factura: str = Field(default="B", max_length=1)


class FacturaRead(SQLModel):
    id: int
    pedido_id: int
    numero_factura: str
    fecha_emision: datetime
    cuit_cliente: Optional[str] = None
    tipo_factura: str
    monto_total: float
