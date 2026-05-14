## Context

Food Store v5.0 tiene un sistema de pedidos completo con creación atómica (order-creation-snapshots), FSM de estados, y pago vía MercadoPago (Sprint 6). Sin embargo no existe ningún comprobante fiscal. Los pedidos completados (ENTREGADO) no generan factura, y no hay forma de obtener un PDF descargable.

Este diseño cubre la generación automática de facturas en PDF, su persistencia, y endpoints de descarga para cliente y admin.

## Goals / Non-Goals

**Goals:**
- Entidad `Factura` con relación 1:1 a `Pedido` con datos fiscales mínimos
- Generación de PDF comercial con snapshots del pedido (ReportLab)
- Endpoint `POST /pedidos/{id}/factura` para generar (solo desde estado ENTREGADO, dentro de un UoW)
- Endpoint `GET /pedidos/{id}/factura` para descargar PDF (StreamingResponse)
- Botón "Descargar Factura" en frontend (cliente en PagoResultPage + admin en listado)

**Non-Goals:**
- Facturación electrónica AFIP / régimen fiscal argentino completo (no hay validación de CUIT ni registración)
- Envío por email de la factura
- Historial de múltiples facturas por pedido (es 1:1)
- Cancelación/anulación de facturas (se destruiría la inmutabilidad)
- Paginación o listado de facturas

## Decisions

### 1. ReportLab sobre FPDF2
**Decisión**: Usar `reportlab` (vs FPDF2 o weasyprint).
**Por qué**: ReportLab es la librería PDF más madura en Python, tiene buen soporte para tablas, fonts, y no requiere wkhtmltopdf (como weasyprint). FPDF2 es más liviano pero tiene APIs menos flexibles para tablas complejas y headers personalizados.

### 2. StreamingResponse sobre Response
**Decisión**: Usar `StreamingResponse` con `io.BytesIO` para devolver el PDF.
**Por qué**: `StreamingResponse` permite enviar el PDF generado en memoria sin escribir a disco, y da control fino sobre headers (`Content-Disposition`, `Content-Type`). Es el patrón recomendado por FastAPI para contenido dinámico.

### 3. FacturaService como clase (no función suelta)
**Decisión**: `FacturaService` será una clase con `generate_pdf(factura, pedido) -> bytes` como método de instancia.
**Por qué**: Si en el futuro queremos cambiar de template o agregar distintos formatos de factura (A/B/C con distinto layout), tener una clase permite extender por herencia o composición sin romper la interfaz.

### 4. Estado FACTURADO en la FSM
**Decisión**: Agregar estado `FACTURADO` como terminal (después de `ENTREGADO`).
**Por qué**: La FSM actual termina en `ENTREGADO` o `CANCELADO`. Facturar es un paso POST-entrega. No tiene sentido permitir facturar un pedido cancelado o no entregado. El flujo queda: `ENTREGADO → FACTURADO` (terminal).

### 5. Número de factura secuencial simple
**Decisión**: El `numero_factura` se genera como `FACT-{YYYYMMDD}-{sequential_id}` usando el ID de la Factura.
**Por qué**: No hay requirement de registro de facturación electrónica. Un formato legible y cronológico es suficiente. Si en el futuro se necesita integrar con AFIP, se puede cambiar.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| El PDF generado puede ser grande con muchos items | ReportLab maneja tablas con paginación automática; limitar items por pedido no es necesario porque los pedidos ya tienen límite implícito de stock |
| ReportLab no está en las dependencias actuales | Agregar `reportlab` a `requirements.txt`, es un package estándar de PyPI |
| El estado `FACTURADO` puede romper FSM existente | Solo se agrega una transición válida (`ENTREGADO → FACTURADO`). No se modifican transiciones existentes. El `HistorialEstadoPedido` registra el cambio |
| La generación de PDF puede fallar (out of memory, etc.) | Todo dentro de un UoW: si falla, rollback de la Factura y el estado no se persiste. El PDF solo se genera si la transacción COMMITea |
| DUPLICADO: POST /factura puede ser llamado múltiples veces | El service verifica si ya existe Factura para ese Pedido antes de generar. Si existe → HTTP 409 Conflict |

## Migration Plan

1. Agregar `reportlab` a `backend/requirements.txt`
2. Crear `backend/models/factura.py` con modelo Factura
3. Agregar `Factura` a `backend/models/__init__.py`
4. Actualizar `backend/services/__init__.py`
5. Crear `backend/services/factura_service.py` con lógica PDF + DB
6. Agregar `POST /pedidos/{id}/factura` y `GET /pedidos/{id}/factura` a `backend/routers/pedidos.py`
7. Actualizar FSM en `pedido_service.py` para aceptar `ENTREGADO → FACTURADO`
8. Agregar `facturaApi` y tipos en frontend
9. Agregar botón descarga en `PagoResultPage.tsx`
10. Agregar botón descarga en admin listado
11. Ejecutar `python backend/main.py` para crear tabla

Rollback: Revertir la migración de Alembic, remover modelo Factura y endpoints.
