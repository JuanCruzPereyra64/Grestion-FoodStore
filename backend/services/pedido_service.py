from sqlmodel import select
from fastapi import HTTPException
from backend.models.direccion import DireccionEntrega
from backend.models.pedido import HistorialEstadoPedido, Pedido, PedidoDetalle
from backend.models.producto import ProductoIngrediente
from backend.models.usuario import Usuario
from backend.schemas.pedido import PedidoCreate
from backend.services import producto_service
from backend.uow.unit_of_work import UnitOfWork

# Estados del Pedido (FSM) — deben coincidir exactamente con estados_pedido.codigo
ESTADO_PENDIENTE = "PENDIENTE"
ESTADO_CONFIRMADO = "CONFIRMADO"
ESTADO_EN_PREPARACION = "EN_PREPARACION"
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
    estado_anterior = pedido.estado_codigo
    permitidos = TRANSICIONES_FSM.get(estado_anterior, [])
    if nuevo_estado not in permitidos:
        raise HTTPException(
            status_code=400,
            detail=f"Transición inválida: {estado_anterior} → {nuevo_estado}. "
                   f"Permitidas: {permitidos}",
        )

    pedido.estado_codigo = nuevo_estado
    uow.pedidos.add(pedido)

    historial = HistorialEstadoPedido(
        pedido_id=pedido.id,
        estado=nuevo_estado,
        estado_desde=estado_anterior,
    )
    uow.session.add(historial)


def create(uow: UnitOfWork, data: PedidoCreate) -> Pedido:
    # Forma vinculada: usa usuario_id + direccion_id
    if data.usuario_id and data.direccion_id:
        usuario = uow.session.get(Usuario, data.usuario_id)
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        direccion = uow.session.get(DireccionEntrega, data.direccion_id)
        if not direccion:
            raise HTTPException(status_code=404, detail="Dirección no encontrada")
        if direccion.usuario_id != data.usuario_id:
            raise HTTPException(status_code=403, detail="La dirección no pertenece al usuario")
        cliente_nombre = usuario.nombre
        direccion_snapshot = f"{direccion.alias} — {direccion.linea1}, {direccion.ciudad} ({direccion.cp})"
        forma_pago = data.forma_pago_codigo or "EFECTIVO"
    else:
        # Forma libre: datos del checkout
        if not data.cliente_nombre:
            raise HTTPException(status_code=422, detail="cliente_nombre es requerido")
        zona = f" ({data.zona_envio})" if data.zona_envio else ""
        cliente_nombre = data.cliente_nombre
        direccion_snapshot = f"{data.direccion or ''}{zona}".strip()
        forma_pago = "MERCADOPAGO" if not data.forma_pago_codigo else data.forma_pago_codigo

    pedido = Pedido(
        cliente_nombre=cliente_nombre,
        direccion_snapshot=direccion_snapshot,
        total=0.0,
        estado_codigo=ESTADO_PENDIENTE,
        usuario_id=data.usuario_id,
        direccion_id=data.direccion_id,
        forma_pago_codigo=forma_pago,
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
    uow.session.flush()
    uow.session.refresh(pedido)

    return pedido


def get_all(uow: UnitOfWork, offset: int = 0, limit: int = 100) -> list[Pedido]:
    return uow.pedidos.get_all(offset, limit)


def get_by_id(uow: UnitOfWork, pedido_id: int) -> Pedido:
    pedido = uow.pedidos.get_by_id(pedido_id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido


def get_by_usuario_id(uow: UnitOfWork, usuario_id: int) -> list[Pedido]:
    return uow.pedidos.get_by_usuario_id(usuario_id)


def cambiar_estado(uow: UnitOfWork, pedido_id: int, nuevo_estado: str) -> Pedido:
    pedido = get_by_id(uow, pedido_id)
    transicionar_estado(uow, pedido, nuevo_estado)
    return pedido


def cancelar(uow: UnitOfWork, pedido_id: int) -> None:
    pedido = get_by_id(uow, pedido_id)
    transicionar_estado(uow, pedido, ESTADO_CANCELADO)
