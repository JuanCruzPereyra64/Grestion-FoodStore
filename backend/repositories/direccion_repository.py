from typing import Optional
from sqlmodel import Session, select
from backend.models.direccion import DireccionEntrega


class DireccionRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, direccion_id: int) -> Optional[DireccionEntrega]:
        return self.session.get(DireccionEntrega, direccion_id)

    def get_by_usuario(self, usuario_id: int) -> list[DireccionEntrega]:
        statement = select(DireccionEntrega).where(DireccionEntrega.usuario_id == usuario_id)
        return list(self.session.exec(statement).all())

    def add(self, direccion: DireccionEntrega) -> None:
        self.session.add(direccion)

    def delete(self, direccion: DireccionEntrega) -> None:
        self.session.delete(direccion)

    def set_principal(self, usuario_id: int, direccion_id: int) -> None:
        for d in self.get_by_usuario(usuario_id):
            d.es_principal = d.id == direccion_id
            self.session.add(d)
