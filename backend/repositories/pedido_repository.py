from typing import Optional
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from backend.models.pedido import Pedido, PedidoDetalle


class PedidoRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self, offset: int = 0, limit: int = 100) -> list[Pedido]:
        statement = (
            select(Pedido)
            .options(selectinload(Pedido.detalles))
            .offset(offset)
            .limit(limit)
        )
        return list(self.session.exec(statement).all())

    def get_by_id(self, pedido_id: int) -> Optional[Pedido]:
        statement = (
            select(Pedido)
            .where(Pedido.id == pedido_id)
            .options(selectinload(Pedido.detalles))
        )
        return self.session.exec(statement).first()

    def add(self, pedido: Pedido) -> None:
        self.session.add(pedido)
