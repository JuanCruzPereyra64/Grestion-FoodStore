from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from backend.database import get_uow
from backend.dependencies.auth import require_role
from backend.schemas.factura import FacturaCreate, FacturaRead
from backend.schemas.pedido import PedidoCreate, PedidoEstadoUpdate, PedidoRead
from backend.services import pedido_service
from backend.services.factura_service import FacturaService
from backend.uow.unit_of_work import UnitOfWork

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


@router.get("/", response_model=list[PedidoRead])
def get_pedidos(
    uow: UnitOfWork = Depends(get_uow),
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
    usuario_id: Optional[int] = None,
):
    if usuario_id is not None:
        return pedido_service.get_by_usuario_id(uow, usuario_id)
    return pedido_service.get_all(uow, offset, limit)


@router.get("/{pedido_id}", response_model=PedidoRead)
def get_pedido(pedido_id: int, uow: UnitOfWork = Depends(get_uow)):
    return pedido_service.get_by_id(uow, pedido_id)


@router.post("/", response_model=PedidoRead, status_code=201)
def create_pedido(
    data: PedidoCreate,
    uow: UnitOfWork = Depends(get_uow),
    _: None = Depends(require_role(["CLIENT"])),
):
    return pedido_service.create(uow, data)


@router.patch("/{pedido_id}/estado", response_model=PedidoRead)
def cambiar_estado(
    pedido_id: int,
    data: PedidoEstadoUpdate,
    uow: UnitOfWork = Depends(get_uow),
    _: None = Depends(require_role(["PEDIDOS", "ADMIN"])),
):
    return pedido_service.cambiar_estado(uow, pedido_id, data.nuevo_estado)


@router.delete("/{pedido_id}", status_code=204)
def cancelar_pedido(
    pedido_id: int,
    uow: UnitOfWork = Depends(get_uow),
    _: None = Depends(require_role(["CLIENT", "ADMIN"])),
):
    pedido_service.cancelar(uow, pedido_id)


@router.post("/{pedido_id}/factura", response_model=FacturaRead, status_code=201)
def generar_factura(
    pedido_id: int,
    data: FacturaCreate,
    uow: UnitOfWork = Depends(get_uow),
    _: None = Depends(require_role(["PEDIDOS", "ADMIN"])),
):
    svc = FacturaService()
    return svc.create(uow, pedido_id, data)


@router.get("/{pedido_id}/factura")
def descargar_factura(pedido_id: int, uow: UnitOfWork = Depends(get_uow)):
    svc = FacturaService()
    factura = svc.get_by_pedido(uow, pedido_id)
    pedido = pedido_service.get_by_id(uow, pedido_id)
    pdf_bytes = svc.generate_pdf(factura, pedido)

    return StreamingResponse(
        iter([pdf_bytes]),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="factura-{factura.numero_factura}.pdf"',
        },
    )
