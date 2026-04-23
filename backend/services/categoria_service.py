from sqlmodel import Session, select
from fastapi import HTTPException
from backend.models.categoria import Categoria
from backend.schemas.categoria import CategoriaCreate, CategoriaUpdate


def get_all(session: Session) -> list[Categoria]:
    return session.exec(select(Categoria)).all()


def get_by_id(session: Session, categoria_id: int) -> Categoria:
    categoria = session.get(Categoria, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria


def create(session: Session, data: CategoriaCreate) -> Categoria:
    categoria = Categoria.model_validate(data)
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


def update(session: Session, categoria_id: int, data: CategoriaUpdate) -> Categoria:
    categoria = get_by_id(session, categoria_id)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(categoria, key, value)
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


def delete(session: Session, categoria_id: int) -> None:
    categoria = get_by_id(session, categoria_id)
    session.delete(categoria)
    session.commit()
