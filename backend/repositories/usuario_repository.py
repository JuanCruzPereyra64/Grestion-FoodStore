from typing import Optional
from sqlmodel import Session, select
from backend.models.usuario import Usuario, UsuarioRol


class UsuarioRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, usuario_id: int) -> Optional[Usuario]:
        return self.session.get(Usuario, usuario_id)

    def get_by_email(self, email: str) -> Optional[Usuario]:
        statement = select(Usuario).where(Usuario.email == email)
        return self.session.exec(statement).first()

    def add(self, usuario: Usuario) -> None:
        self.session.add(usuario)

    def get_roles(self, usuario_id: int) -> list[str]:
        from backend.models.usuario import Rol
        statement = (
            select(Rol.nombre)
            .join(UsuarioRol, UsuarioRol.rol_id == Rol.id)
            .where(UsuarioRol.usuario_id == usuario_id)
        )
        return list(self.session.exec(statement).all())
