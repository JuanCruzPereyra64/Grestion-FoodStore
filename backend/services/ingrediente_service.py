from sqlmodel import Session, select
from fastapi import HTTPException
from backend.models.ingrediente import Ingrediente
from backend.schemas.ingrediente import IngredienteCreate, IngredienteUpdate


def get_all(session: Session) -> list[Ingrediente]:
    return session.exec(select(Ingrediente)).all()


def get_by_id(session: Session, ingrediente_id: int) -> Ingrediente:
    ingrediente = session.get(Ingrediente, ingrediente_id)
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return ingrediente


def create(session: Session, data: IngredienteCreate) -> Ingrediente:
    ingrediente = Ingrediente.model_validate(data)
    session.add(ingrediente)
    session.commit()
    session.refresh(ingrediente)
    return ingrediente


def update(session: Session, ingrediente_id: int, data: IngredienteUpdate) -> Ingrediente:
    ingrediente = get_by_id(session, ingrediente_id)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(ingrediente, key, value)
    session.add(ingrediente)
    session.commit()
    session.refresh(ingrediente)
    return ingrediente


def delete(session: Session, ingrediente_id: int) -> None:
    ingrediente = get_by_id(session, ingrediente_id)
    session.delete(ingrediente)
    session.commit()
