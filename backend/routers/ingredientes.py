from fastapi import APIRouter, Depends
from sqlmodel import Session
from backend.database import get_session
from backend.schemas.ingrediente import IngredienteCreate, IngredienteRead, IngredienteUpdate
from backend.services import ingrediente_service

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])


@router.get("/", response_model=list[IngredienteRead])
def get_ingredientes(session: Session = Depends(get_session)):
    return ingrediente_service.get_all(session)


@router.get("/{ingrediente_id}", response_model=IngredienteRead)
def get_ingrediente(ingrediente_id: int, session: Session = Depends(get_session)):
    return ingrediente_service.get_by_id(session, ingrediente_id)


@router.post("/", response_model=IngredienteRead, status_code=201)
def create_ingrediente(data: IngredienteCreate, session: Session = Depends(get_session)):
    return ingrediente_service.create(session, data)


@router.put("/{ingrediente_id}", response_model=IngredienteRead)
def update_ingrediente(ingrediente_id: int, data: IngredienteUpdate, session: Session = Depends(get_session)):
    return ingrediente_service.update(session, ingrediente_id, data)


@router.delete("/{ingrediente_id}", status_code=204)
def delete_ingrediente(ingrediente_id: int, session: Session = Depends(get_session)):
    ingrediente_service.delete(session, ingrediente_id)
