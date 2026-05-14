from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel


class Pago(SQLModel, table=True):
    __tablename__ = "pagos"

    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedidos.id")
    mp_preference_id: Optional[str] = Field(default=None, max_length=200)
    mp_payment_id: Optional[int] = Field(default=None)
    status: str = Field(default="pending", max_length=50)
    status_detail: Optional[str] = Field(default=None, max_length=200)
    external_reference: Optional[str] = Field(default=None, max_length=200)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
