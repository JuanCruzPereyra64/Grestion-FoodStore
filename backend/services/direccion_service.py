from fastapi import HTTPException
from backend.models.direccion import DireccionEntrega
from backend.schemas.direccion import DireccionCreate, DireccionUpdate
from backend.uow.unit_of_work import UnitOfWork


def get_all_by_usuario(uow: UnitOfWork, usuario_id: int) -> list[DireccionEntrega]:
    return uow.direcciones.get_by_usuario(usuario_id)


def get_by_id(uow: UnitOfWork, direccion_id: int) -> DireccionEntrega:
    d = uow.direcciones.get_by_id(direccion_id)
    if not d:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    return d


def create(uow: UnitOfWork, data: DireccionCreate) -> DireccionEntrega:
    direccion = DireccionEntrega(**data.model_dump())
    uow.direcciones.add(direccion)
    uow.session.flush()
    return direccion


def update(uow: UnitOfWork, direccion_id: int, data: DireccionUpdate) -> DireccionEntrega:
    d = get_by_id(uow, direccion_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(d, field, value)
    uow.session.add(d)
    return d


def delete(uow: UnitOfWork, direccion_id: int) -> None:
    d = get_by_id(uow, direccion_id)
    uow.direcciones.delete(d)


def set_principal(uow: UnitOfWork, direccion_id: int) -> DireccionEntrega:
    d = get_by_id(uow, direccion_id)
    uow.direcciones.set_principal(d.usuario_id, direccion_id)
    return d
