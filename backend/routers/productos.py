from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from backend.database import get_session
from backend.schemas.producto import ProductoCreate, ProductoRead, ProductoUpdate
from backend.services import producto_service

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("/", response_model=list[ProductoRead])
def get_productos(
    session: Session = Depends(get_session),
    categoria_id: Annotated[Optional[int], Query(description="Filtrar por categoría")] = None,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
):
    return producto_service.get_all(session, categoria_id, offset, limit)


@router.get("/{producto_id}", response_model=ProductoRead)
def get_producto(producto_id: int, session: Session = Depends(get_session)):
    return producto_service.get_by_id(session, producto_id)


@router.post("/", response_model=ProductoRead, status_code=201)
def create_producto(data: ProductoCreate, session: Session = Depends(get_session)):
    return producto_service.create(session, data)


@router.put("/{producto_id}", response_model=ProductoRead)
def update_producto(producto_id: int, data: ProductoUpdate, session: Session = Depends(get_session)):
    return producto_service.update(session, producto_id, data)


@router.delete("/{producto_id}", status_code=204)
def delete_producto(producto_id: int, session: Session = Depends(get_session)):
    producto_service.delete(session, producto_id)


@router.post("/{producto_id}/ingredientes/{ingrediente_id}", response_model=ProductoRead)
def add_ingrediente(producto_id: int, ingrediente_id: int, session: Session = Depends(get_session)):
    return producto_service.add_ingrediente(session, producto_id, ingrediente_id)


@router.delete("/{producto_id}/ingredientes/{ingrediente_id}", response_model=ProductoRead)
def remove_ingrediente(producto_id: int, ingrediente_id: int, session: Session = Depends(get_session)):
    return producto_service.remove_ingrediente(session, producto_id, ingrediente_id)
