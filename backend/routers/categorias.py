from fastapi import APIRouter, Depends
from sqlmodel import Session
from backend.database import get_session
from backend.schemas.categoria import CategoriaCreate, CategoriaRead, CategoriaUpdate
from backend.services import categoria_service

router = APIRouter(prefix="/categorias", tags=["Categorías"])


@router.get("/", response_model=list[CategoriaRead])
def get_categorias(session: Session = Depends(get_session)):
    return categoria_service.get_all(session)


@router.get("/{categoria_id}", response_model=CategoriaRead)
def get_categoria(categoria_id: int, session: Session = Depends(get_session)):
    return categoria_service.get_by_id(session, categoria_id)


@router.post("/", response_model=CategoriaRead, status_code=201)
def create_categoria(data: CategoriaCreate, session: Session = Depends(get_session)):
    return categoria_service.create(session, data)


@router.put("/{categoria_id}", response_model=CategoriaRead)
def update_categoria(categoria_id: int, data: CategoriaUpdate, session: Session = Depends(get_session)):
    return categoria_service.update(session, categoria_id, data)


@router.delete("/{categoria_id}", status_code=204)
def delete_categoria(categoria_id: int, session: Session = Depends(get_session)):
    categoria_service.delete(session, categoria_id)
