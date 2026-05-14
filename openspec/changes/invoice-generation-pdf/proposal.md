## Why

Actualmente los pedidos completados no generan ningún comprobante fiscal. El cliente no puede descargar una factura, lo cual es necesario para rendiciones, garantías, y registros contables. Esta feature agrega generación automática de facturas en PDF vinculadas 1:1 al Pedido, con descarga tanto para el cliente como para el administrador.

## What Changes

- **Backend — Modelo Factura**: Nueva entidad `Factura` con relación 1:1 a `Pedido`, incluyendo `numero_factura`, `fecha_emision`, `cuit_cliente`, `tipo_factura` (A/B/C), `monto_total`.
- **Backend — Servicio PDF**: Nuevo servicio `factura_service.py` usando ReportLab que genera un PDF con formato comercial a partir del Pedido (snapshots de precios, nombre, dirección).
- **Backend — Endpoints**:
  - `POST /api/v1/pedidos/{id}/factura` — Genera la Factura (cambia estado del pedido, persiste Factura en BD).
  - `GET /api/v1/pedidos/{id}/factura` — Retorna el PDF como `StreamingResponse` para descarga.
- **Backend — Dependencia**: Agregar `reportlab` a `requirements.txt`.
- **Frontend — Cliente**: Botón "Descargar Factura" en la pantalla de resultado exitoso del pago (`PagoResultPage`).
- **Frontend — Admin**: Botón "Descargar Factura" en la tabla/listado de pedidos (solo para pedidos en estado `ENTREGADO` o pagados).
- **Frontend — API**: Nuevo método `getFactura` en `pedidosApi` que descarga el blob binario del PDF.

## Capabilities

### New Capabilities
- `invoice-download`: Generación automática y descarga de facturas en PDF para pedidos completados / pagados.

### Modified Capabilities
- Ninguna — no se modifican specs existentes.

## Impact

| Area | Impact | Description |
|------|--------|-------------|
| `backend/models/factura.py` | New | Nueva entidad Factura con relación 1:1 a Pedido |
| `backend/services/factura_service.py` | New | Servicio de generación de PDF con ReportLab |
| `backend/routers/pedidos.py` | High | 2 nuevos endpoints: POST y GET /{id}/factura |
| `backend/models/__init__.py` | Medium | Exportar nuevo modelo |
| `backend/requirements.txt` | Low | Agregar `reportlab` |
| `frontend/src/services/api.ts` | Medium | Nuevo método `getFactura` que descarga blob |
| `frontend/src/pages/PagoResultPage.tsx` | Medium | Botón "Descargar Factura" en success |
| `frontend/src/pages/ProductosPage.tsx` o admin panel | Medium | Botón de descarga para administradores |
