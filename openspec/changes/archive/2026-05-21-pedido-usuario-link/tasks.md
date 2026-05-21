## 1. Modelo — agregar FKs a Pedido

- [x] 1.1 En `backend/models/pedido.py`: agregar `usuario_id: Optional[int] = Field(default=None, foreign_key="usuarios.id")` al modelo `Pedido`
- [x] 1.2 En `backend/models/pedido.py`: agregar `direccion_id: Optional[int] = Field(default=None, foreign_key="direcciones_entrega.id")` al modelo `Pedido`
- [x] 1.3 En `backend/models/pedido.py`: agregar `forma_pago_codigo: Optional[str] = Field(default=None, foreign_key="formas_pago.codigo")` al modelo `Pedido`
- [x] 1.4 En `backend/models/pedido.py`: renombrar campo `estado: str = "PENDIENTE"` por `estado_codigo: str = Field(default="PENDIENTE", foreign_key="estados_pedido.codigo")` en el modelo `Pedido`
- [x] 1.5 En `backend/models/pedido.py`: agregar `Relationship` `usuario: Optional["Usuario"] = Relationship(back_populates="pedidos")` al modelo `Pedido`
- [x] 1.6 En `backend/models/usuario.py`: agregar `pedidos: list["Pedido"] = Relationship(back_populates="usuario")` al modelo `Usuario` (con `TYPE_CHECKING` import si necesario)

## 2. Schemas — actualizar PedidoCreate y PedidoRead

- [x] 2.1 En `backend/schemas/pedido.py`: reemplazar `cliente_nombre: str` y `direccion: str` en `PedidoCreate` por `usuario_id: int`, `direccion_id: int` y `forma_pago_codigo: str`
- [x] 2.2 En `backend/schemas/pedido.py`: actualizar `PedidoRead` para incluir `usuario_id: Optional[int]`, `direccion_id: Optional[int]`, `forma_pago_codigo: Optional[str]` y renombrar `direccion_snapshot: str` → mantener como está (ya existe)
- [x] 2.3 En `backend/schemas/pedido.py`: actualizar `PedidoRead` para exponer `estado_codigo: str` (renombrado desde `estado`)

## 3. Servicio — lógica de creación con validaciones de usuario/dirección

- [x] 3.1 En `backend/services/pedido_service.py`: en la función `create`, cargar `Usuario` por `data.usuario_id` usando `uow.session` — lanzar `HTTPException 404` si no existe
- [x] 3.2 En `backend/services/pedido_service.py`: en la función `create`, cargar `DireccionEntrega` por `data.direccion_id` — lanzar `HTTPException 404` si no existe, `HTTPException 403` si `direccion.usuario_id != data.usuario_id`
- [x] 3.3 En `backend/services/pedido_service.py`: en la función `create`, derivar `cliente_nombre` desde `usuario.nombre` y `direccion_snapshot` desde los campos de `DireccionEntrega` (formato: `"{alias} — {linea1}, {ciudad} ({cp})"`)
- [x] 3.4 En `backend/services/pedido_service.py`: en la función `create`, pasar `usuario_id`, `direccion_id`, `forma_pago_codigo` y `estado_codigo="PENDIENTE"` al construir el objeto `Pedido`
- [x] 3.5 En `backend/services/pedido_service.py`: corregir bug en `transicionar_estado` — capturar el estado anterior ANTES de asignar `pedido.estado_codigo = nuevo_estado` y usar ese valor en `HistorialEstadoPedido.estado_desde`
- [x] 3.6 En `backend/services/pedido_service.py`: actualizar todas las referencias internas al campo `estado` por `estado_codigo` (TRANSICIONES_FSM dict keys/values no cambian — solo el atributo del objeto)

## 4. Repositorio — filtro por usuario_id

- [x] 4.1 En `backend/repositories/pedido_repository.py`: agregar método `get_by_usuario_id(self, usuario_id: int) -> list[Pedido]`

## 5. Router — actualizar endpoints

- [x] 5.1 En `backend/routers/pedidos.py`: agregar query param opcional `usuario_id: Optional[int] = None` en `GET /pedidos` y delegar a `pedido_service.get_by_usuario_id` o `get_all` según corresponda
- [x] 5.2 En `backend/services/pedido_service.py`: agregar función `get_by_usuario_id(uow, usuario_id) -> list[Pedido]` que delega a `uow.pedidos.get_by_usuario_id`

## 6. Exportaciones y compatibilidad

- [x] 6.1 En `backend/models/__init__.py`: verificar que `DireccionEntrega` está exportado (requerido por las nuevas FKs en `Pedido`) — agregar si falta
- [x] 6.2 Verificar que `backend/services/auth_service.py` ya siembra `EstadoPedido` y `FormaPago` con los códigos exactos usados en el FSM (`PENDIENTE`, `CONFIRMADO`, `EN_PREPARACION`, `LISTO`, `ENTREGADO`, `CANCELADO`, `EFECTIVO`, `MERCADOPAGO`) — corregir si hay discrepancias
