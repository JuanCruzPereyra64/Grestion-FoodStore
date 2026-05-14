from sqlmodel import select
from fastapi import HTTPException
from backend.models.pedido import HistorialEstadoPedido, Pedido, PedidoDetalle
from backend.models.producto import ProductoIngrediente
from backend.schemas.pedido import PedidoCreate
from backend.services import producto_service
from backend.uow.unit_of_work import UnitOfWork

# Estados del Pedido (FSM)
ESTADO_PENDIENTE = "PENDIENTE"
ESTADO_CONFIRMADO = "CONFIRMADO"
ESTADO_EN_PREPARACION = "EN_PREPARACIÓN"
ESTADO_EN_CAMINO = "EN_CAMINO"
ESTADO_ENTREGADO = "ENTREGADO"
ESTADO_FACTURADO = "FACTURADO"
ESTADO_CANCELADO = "CANCELADO"

# Mapa de transiciones válidas: estado_actual -> [estados_siguientes]
TRANSICIONES_FSM = {
    ESTADO_PENDIENTE: [ESTADO_CONFIRMADO, ESTADO_CANCELADO],
    ESTADO_CONFIRMADO: [ESTADO_EN_PREPARACION, ESTADO_CANCELADO],
    ESTADO_EN_PREPARACION: [ESTADO_EN_CAMINO, ESTADO_CANCELADO],
    ESTADO_EN_CAMINO: [ESTADO_ENTREGADO],
    ESTADO_ENTREGADO: [ESTADO_FACTURADO],
    ESTADO_FACTURADO: [],
    ESTADO_CANCELADO: [],
}


def transicionar_estado(uow: UnitOfWork, pedido: Pedido, nuevo_estado: str) -> None:
    """Valida y aplica una transición de estado, registrando en HistorialEstadoPedido."""
    permitidos = TRANSICIONES_FSM.get(pedido.estado, [])
    if nuevo_estado not in permitidos:
        raise HTTPException(
            status_code=400,
            detail=f"Transición inválida: {pedido.estado} → {nuevo_estado}. "
                   f"Permitidas: {permitidos}",
        )

    pedido.estado = nuevo_estado
    uow.pedidos.add(pedido)

    historial = HistorialEstadoPedido(
        pedido_id=pedido.id,
        estado=nuevo_estado,
        estado_desde=pedido.estado,  # guardamos el anterior como referencia
    )
    uow.session.add(historial)


def create(uow: UnitOfWork, data: PedidoCreate) -> Pedido:
    pedido = Pedido(
        cliente_nombre=data.cliente_nombre,
        direccion_snapshot=data.direccion,
        total=0.0,
    )
    uow.pedidos.add(pedido)
    uow.session.flush()

    total = 0.0

    for item in data.items:
        producto = producto_service.get_by_id(uow, item.producto_id)

        if not producto.disponible:
            raise HTTPException(
                status_code=400,
                detail=f"El producto '{producto.nombre}' no está disponible",
            )

        # Decrementar stock de ingredientes
        excluded = set(item.excluded_ingrediente_ids or [])
        stmt = select(ProductoIngrediente).where(
            ProductoIngrediente.producto_id == item.producto_id
        )
        links = uow.session.exec(stmt).all()
        for link in links:
            if link.ingrediente_id in excluded:
                continue
            ing = uow.ingredientes.get_by_id(link.ingrediente_id)
            if not ing:
                raise HTTPException(
                    status_code=404,
                    detail=f"Ingrediente ID {link.ingrediente_id} no encontrado",
                )
            necesario = link.cantidad_requerida * item.cantidad
            if ing.stock < necesario:
                raise HTTPException(
                    status_code=400,
                    detail=f"Stock insuficiente de '{ing.nombre}': "
                    f"disponible {ing.stock}, necesario {necesario}",
                )
            ing.stock -= necesario
            uow.ingredientes.add(ing)

        subtotal = producto.precio_base * item.cantidad
        total += subtotal

        detalle = PedidoDetalle(
            pedido_id=pedido.id,
            producto_id=item.producto_id,
            producto_nombre_snapshot=producto.nombre,
            precio_unitario_snapshot=producto.precio_base,
            cantidad=item.cantidad,
            subtotal=subtotal,
            personalizacion=item.excluded_ingrediente_ids,
        )
        uow.session.add(detalle)

    pedido.total = total
    uow.pedidos.add(pedido)
    uow.commit()
    uow.session.refresh(pedido)

    return pedido


def get_all(uow: UnitOfWork, offset: int = 0, limit: int = 100) -> list[Pedido]:
    return uow.pedidos.get_all(offset, limit)


def get_by_id(uow: UnitOfWork, pedido_id: int) -> Pedido:
    pedido = uow.pedidos.get_by_id(pedido_id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido
