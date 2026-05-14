from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel


class Factura(SQLModel, table=True):
    __tablename__ = "facturas"

    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedidos.id", unique=True, index=True)
    numero_factura: str = Field(max_length=50, unique=True, index=True)
    fecha_emision: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    cuit_cliente: Optional[str] = Field(default=None, max_length=20)
    tipo_factura: str = Field(default="B", max_length=1)
    monto_total: float = Field(ge=0.0)
