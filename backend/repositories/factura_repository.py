from typing import Optional
from sqlmodel import Session, select
from backend.models.factura import Factura


class FacturaRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_pedido_id(self, pedido_id: int) -> Optional[Factura]:
        statement = select(Factura).where(Factura.pedido_id == pedido_id)
        return self.session.exec(statement).first()

    def add(self, factura: Factura) -> None:
        self.session.add(factura)
