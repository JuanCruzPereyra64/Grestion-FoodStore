from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship, SQLModel, Column
from sqlalchemy import ARRAY, Integer, Text

if TYPE_CHECKING:
    from backend.models.producto import Producto


class HistorialEstadoPedido(SQLModel, table=True):
    __tablename__ = "historial_estado_pedido"

    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedidos.id")
    estado: str = Field(max_length=50)
    estado_desde: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Pedido(SQLModel, table=True):
    __tablename__ = "pedidos"

    id: Optional[int] = Field(default=None, primary_key=True)
    cliente_nombre: str = Field(min_length=1, max_length=200)
    direccion_snapshot: str = Field(sa_column=Column(Text))
    total: float = Field(ge=0.0)
    estado: str = Field(default="PENDIENTE", max_length=50)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    detalles: list["PedidoDetalle"] = Relationship(back_populates="pedido")


class PedidoDetalle(SQLModel, table=True):
    __tablename__ = "pedido_detalles"

    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedidos.id")
    producto_id: int = Field(foreign_key="productos.id")
    producto_nombre_snapshot: str = Field(min_length=1, max_length=150)
    precio_unitario_snapshot: float = Field(ge=0.0)
    cantidad: int = Field(ge=1)
    subtotal: float = Field(ge=0.0)
    personalizacion: list[int] = Field(default_factory=list, sa_column=Column(ARRAY(Integer)))

    pedido: Pedido = Relationship(back_populates="detalles")
    producto: Optional["Producto"] = Relationship()
