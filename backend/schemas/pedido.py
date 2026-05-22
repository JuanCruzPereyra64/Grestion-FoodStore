from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class PedidoItem(SQLModel):
    producto_id: int
    cantidad: int = Field(ge=1)
    excluded_ingrediente_ids: list[int] = Field(default=[])


class PedidoCreate(SQLModel):
    # Forma libre (desde CheckoutPage)
    cliente_nombre: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    zona_envio: Optional[str] = None

    # Modelo vinculado (opcional)
    usuario_id: Optional[int] = None
    direccion_id: Optional[int] = None
    forma_pago_codigo: Optional[str] = None

    items: list[PedidoItem] = Field(min_length=1)


class PedidoDetalleRead(SQLModel):
    id: int
    producto_id: int
    producto_nombre_snapshot: str
    precio_unitario_snapshot: float
    cantidad: int
    subtotal: float
    personalizacion: list[int]


class PedidoEstadoUpdate(SQLModel):
    nuevo_estado: str


class PedidoRead(SQLModel):
    id: int
    cliente_nombre: str
    direccion_snapshot: str
    estado_codigo: str
    total: float
    usuario_id: Optional[int]
    direccion_id: Optional[int]
    forma_pago_codigo: Optional[str]
    created_at: datetime
    detalles: list[PedidoDetalleRead]
