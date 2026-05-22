import os
import logging
from datetime import datetime, timezone

from fastapi import HTTPException
from dotenv import load_dotenv
from sqlmodel import select, desc

from backend.models.pago import Pago
from backend.models.pedido import Pedido
from backend.schemas.pago import PreferenceRead
from backend.services.pedido_service import transicionar_estado
from backend.uow.unit_of_work import UnitOfWork

load_dotenv()

logger = logging.getLogger(__name__)


def create_preference(uow: UnitOfWork, pedido_id: int) -> PreferenceRead:
    pedido = uow.pedidos.get_by_id(pedido_id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    if pedido.estado_codigo != "PENDIENTE":
        raise HTTPException(status_code=400, detail="Solo pedidos PENDIENTE pueden generar preferencia")

    try:
        import mercadopago
        sdk = mercadopago.SDK(os.getenv("MERCADOPAGO_ACCESS_TOKEN"))
    except ImportError:
        logger.warning("mercadopago SDK no instalado — usando modo simulación")
        return PreferenceRead(
            id=f"sim_pref_{pedido_id}",
            init_point=f"https://simulacion.mercadopago.com/checkout?pedido={pedido_id}",
            sandbox_init_point=f"https://simulacion.mercadopago.com/checkout?pedido={pedido_id}",
        )

    preference_data = _build_preference_data(pedido)
    result = sdk.preference().create(preference_data)
    response = result.get("response", {})

    if not response or "id" not in response:
        raise HTTPException(status_code=502, detail="Error al crear preferencia en MercadoPago")

    pago = Pago(
        pedido_id=pedido.id,
        mp_preference_id=response["id"],
        status="pending",
        external_reference=str(pedido.id),
    )
    uow.session.add(pago)

    return PreferenceRead(
        id=response["id"],
        init_point=response.get("init_point", ""),
        sandbox_init_point=response.get("sandbox_init_point", ""),
    )


def _build_preference_data(pedido: Pedido) -> dict:
    items = []
    for detalle in pedido.detalles:
        items.append({
            "id": str(detalle.producto_id),
            "title": detalle.producto_nombre_snapshot,
            "quantity": detalle.cantidad,
            "unit_price": detalle.precio_unitario_snapshot,
            "currency_id": "ARS",
        })

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")

    data = {
        "items": items,
        "external_reference": str(pedido.id),
        "back_urls": {
            "success": f"{frontend_url}/pago/success?pedido_id={pedido.id}",
            "failure": f"{frontend_url}/pago/failure?pedido_id={pedido.id}",
            "pending": f"{frontend_url}/pago/pending?pedido_id={pedido.id}",
        },
    }

    if not frontend_url.startswith("http://localhost"):
        data["auto_return"] = "approved"

    if not backend_url.startswith("http://localhost"):
        data["notification_url"] = f"{backend_url}/api/v1/pagos/webhook"

    return data


def process_webhook_notification(uow: UnitOfWork, notification: dict) -> dict:
    if notification.get("type") == "payment":
        payment_id = notification.get("data", {}).get("id")
        if not payment_id:
            raise HTTPException(status_code=400, detail="payment_id no encontrado en la notificación")
        return _process_payment_notification(uow, payment_id)

    return {"status": "ignored", "type": notification.get("type")}


def _process_payment_notification(uow: UnitOfWork, payment_id: int) -> dict:
    try:
        import mercadopago
        sdk = mercadopago.SDK(os.getenv("MERCADOPAGO_ACCESS_TOKEN"))
        result = sdk.payment().get(payment_id)
        payment = result.get("response", {})
    except ImportError:
        logger.warning("mercadopago SDK no instalado — simulando pago aprobado")
        payment = {
            "id": payment_id,
            "status": "approved",
            "external_reference": str(payment_id),
        }

    status = payment.get("status")
    external_ref = payment.get("external_reference", "")

    try:
        pedido_id = int(external_ref)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="external_reference inválido")

    pedido = uow.pedidos.get_by_id(pedido_id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    if status == "approved":
        transicionar_estado(uow, pedido, "CONFIRMADO")

    pago = uow.session.exec(
        select(Pago).where(
            Pago.pedido_id == pedido_id,
            Pago.mp_payment_id == None,
        )
    ).first()

    if pago:
        pago.mp_payment_id = payment_id
        pago.status = status
        pago.status_detail = payment.get("status_detail")
        pago.updated_at = datetime.now(timezone.utc)
        uow.session.add(pago)

    return {"status": "processed", "payment_status": status, "pedido_id": pedido_id}


def get_pago_status(uow: UnitOfWork, pedido_id: int) -> dict:
    pedido = uow.pedidos.get_by_id(pedido_id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    pago = uow.session.exec(
        select(Pago)
        .where(Pago.pedido_id == pedido_id)
        .order_by(desc(Pago.created_at))
        .limit(1)
    ).first()

    return {
        "pedido_id": pedido.id,
        "estado": pedido.estado_codigo,
        "pago": {
            "status": pago.status if pago else None,
            "status_detail": pago.status_detail if pago else None,
            "mp_payment_id": pago.mp_payment_id if pago else None,
        } if pago else None,
    }
