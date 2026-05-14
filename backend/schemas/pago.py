from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel


class PreferenceCreate(SQLModel):
    pedido_id: int


class PreferenceRead(SQLModel):
    id: str
    init_point: str
    sandbox_init_point: str


class PagoRead(SQLModel):
    id: int
    pedido_id: int
    mp_preference_id: Optional[str]
    mp_payment_id: Optional[int]
    status: str
    status_detail: Optional[str]
    external_reference: Optional[str]
    created_at: datetime
    updated_at: datetime
