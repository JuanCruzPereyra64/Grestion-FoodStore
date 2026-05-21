from fastapi import APIRouter, Depends, Query
from backend.database import get_uow
from backend.schemas.direccion import DireccionCreate, DireccionRead, DireccionUpdate
from backend.services import direccion_service
from backend.uow.unit_of_work import UnitOfWork

router = APIRouter(prefix="/direcciones", tags=["Direcciones"])


@router.post("/", response_model=DireccionRead, status_code=201)
def create_direccion(data: DireccionCreate, uow: UnitOfWork = Depends(get_uow)):
    return direccion_service.create(uow, data)


@router.get("/", response_model=list[DireccionRead])
def get_direcciones(usuario_id: int = Query(...), uow: UnitOfWork = Depends(get_uow)):
    return direccion_service.get_all_by_usuario(uow, usuario_id)


@router.get("/{direccion_id}", response_model=DireccionRead)
def get_direccion(direccion_id: int, uow: UnitOfWork = Depends(get_uow)):
    return direccion_service.get_by_id(uow, direccion_id)


@router.put("/{direccion_id}", response_model=DireccionRead)
def update_direccion(direccion_id: int, data: DireccionUpdate, uow: UnitOfWork = Depends(get_uow)):
    return direccion_service.update(uow, direccion_id, data)


@router.delete("/{direccion_id}", status_code=204)
def delete_direccion(direccion_id: int, uow: UnitOfWork = Depends(get_uow)):
    direccion_service.delete(uow, direccion_id)


@router.patch("/{direccion_id}/principal", response_model=DireccionRead)
def set_principal(direccion_id: int, uow: UnitOfWork = Depends(get_uow)):
    return direccion_service.set_principal(uow, direccion_id)
