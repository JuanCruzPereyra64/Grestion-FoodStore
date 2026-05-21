## 1. Backend — Modelo y Dependencias

- [ ] 1.1 Agregar `reportlab` a `backend/requirements.txt`
- [ ] 1.2 Crear `backend/models/factura.py` con modelo Factura (numero_factura, fecha_emision, cuit_cliente, tipo_factura, monto_total, pedido_id FK unique)
- [ ] 1.3 Exportar Factura en `backend/models/__init__.py`
- [ ] 1.4 Agregar estado `FACTURADO` a la FSM en `pedido_service.py` (ENTREGADO → FACTURADO)

## 2. Backend — Servicio de Facturación

- [ ] 2.1 Crear `backend/services/factura_service.py` con clase FacturaService:
  - `generate_pdf(factura, pedido) -> bytes` usando ReportLab (tabla con detalles, header, footer, tipo_factura, cuit)
  - `create(uow, pedido_id, cuit=None, tipo="B") -> Factura`: valida estado ENTREGADO, verifica no duplicado, crea Factura, cambia estado a FACTURADO, registra historial, genera PDF, commit

## 3. Backend — Endpoints

- [ ] 3.1 Agregar `POST /pedidos/{id}/factura` en `pedidos.py` (genera factura, response_model=FacturaRead)
- [ ] 3.2 Agregar `GET /pedidos/{id}/factura` en `pedidos.py` (retorna StreamingResponse con PDF)
- [ ] 3.3 Crear `backend/schemas/factura.py` con FacturaRead/FacturaCreate schemas
- [ ] 3.4 Actualizar `backend/routers/__init__.py` si es necesario

## 4. Frontend — Tipos y API

- [ ] 4.1 Agregar tipos `FacturaRead`, `FacturaCreate` a `frontend/src/types/index.ts`
- [ ] 4.2 Agregar método `getFacturaUrl(id)` y `getFactura(id)` a `pedidosApi` en `api.ts`
- [ ] 4.3 Agregar hook `useDescargarFactura` en `frontend/src/hooks/usePedidos.ts`

## 5. Frontend — UI de Descarga

- [ ] 5.1 Agregar botón "Descargar Factura" en `PagoResultPage.tsx` (solo success, llama a getFactura + descarga blob)
- [ ] 5.2 Agregar botón "Descargar Factura" en la tabla de pedidos para administradores (solo pedidos con Factura asociada)

## 6. Verificación

- [ ] 6.1 Verificar que todos los backend .py compilan (py_compile)
- [ ] 6.2 Verificar TypeScript build (tsc --noEmit)
- [ ] 6.3 Verificar openspec status completo
