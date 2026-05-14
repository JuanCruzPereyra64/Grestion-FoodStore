from fastapi import APIRouter, Depends, Request
from backend.database import get_uow
from backend.schemas.pago import PreferenceCreate, PreferenceRead
from backend.services import mercadopago_service
from backend.uow.unit_of_work import UnitOfWork

router = APIRouter(prefix="/pagos", tags=["Pagos"])


@router.post("/create_preference", response_model=PreferenceRead)
def create_preference(data: PreferenceCreate, uow: UnitOfWork = Depends(get_uow)):
    return mercadopago_service.create_preference(uow, data.pedido_id)


@router.post("/webhook")
async def webhook(request: Request, uow: UnitOfWork = Depends(get_uow)):
    notification = await request.json()
    return mercadopago_service.process_webhook_notification(uow, notification)


@router.get("/{pedido_id}/status")
def get_pago_status(pedido_id: int, uow: UnitOfWork = Depends(get_uow)):
    return mercadopago_service.get_pago_status(uow, pedido_id)
