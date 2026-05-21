import io
from datetime import datetime, timezone

from fastapi import HTTPException
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
)

from backend.models.factura import Factura
from backend.models.pedido import Pedido
from backend.schemas.factura import FacturaCreate
from backend.uow.unit_of_work import UnitOfWork
from backend.services.pedido_service import (
    ESTADO_ENTREGADO,
    transicionar_estado,
)


class FacturaService:
    """Servicio para gestionar facturación y generar PDFs."""

    @staticmethod
    def _generar_numero(factura_id: int) -> str:
        now = datetime.now(timezone.utc)
        return f"FACT-{now.strftime('%Y%m%d')}-{factura_id:05d}"

    def create(self, uow: UnitOfWork, pedido_id: int, data: FacturaCreate) -> Factura:
        # 1. Validar que el pedido existe y está en estado ENTREGADO
        pedido = uow.pedidos.get_by_id(pedido_id)
        if not pedido:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")

        if pedido.estado != ESTADO_ENTREGADO:
            raise HTTPException(
                status_code=400,
                detail=f"No se puede facturar un pedido en estado '{pedido.estado}'. "
                       f"Debe estar en '{ESTADO_ENTREGADO}'.",
            )

        # 2. Verificar que no exista factura previa (1:1)
        factura_existente = uow.facturas.get_by_pedido_id(pedido_id)
        if factura_existente:
            raise HTTPException(
                status_code=409,
                detail=f"Ya existe una factura para el pedido {pedido_id}: "
                       f"'{factura_existente.numero_factura}'",
            )

        # 3. Crear la factura (sin numero_factura aún, lo generamos post-insert)
        factura = Factura(
            pedido_id=pedido_id,
            numero_factura="__TEMP__",
            fecha_emision=datetime.now(timezone.utc),
            cuit_cliente=data.cuit_cliente,
            tipo_factura=data.tipo_factura,
            monto_total=pedido.total,
        )
        uow.facturas.add(factura)
        uow.session.flush()  # para obtener factura.id

        # 4. Generar número secuencial
        factura.numero_factura = self._generar_numero(factura.id)
        uow.facturas.add(factura)

        # 5. Transicionar estado a FACTURADO con auditoría
        transicionar_estado(uow, pedido, "FACTURADO")

        uow.session.flush()
        uow.session.refresh(factura)

        return factura

    @staticmethod
    def generate_pdf(factura: Factura, pedido: Pedido) -> bytes:
        """Genera el PDF de la factura usando ReportLab."""
        buf = io.BytesIO()

        doc = SimpleDocTemplate(
            buf,
            pagesize=A4,
            title=f"Factura {factura.numero_factura}",
            author="Food Store",
        )

        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(
            name="FacturaTitle",
            fontSize=20,
            leading=24,
            spaceAfter=6 * mm,
            alignment=1,  # center
        ))
        styles.add(ParagraphStyle(
            name="FacturaLabel",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#4B5563"),
        ))
        styles.add(ParagraphStyle(
            name="FacturaValue",
            fontSize=10,
            leading=14,
        ))
        styles.add(ParagraphStyle(
            name="FacturaHeader",
            fontSize=10,
            leading=14,
            textColor=colors.white,
        ))

        elements = []

        # --- Header ---
        elements.append(Paragraph("FOOD STORE", styles["FacturaTitle"]))
        elements.append(Paragraph(
            f"Factura {factura.tipo_factura} — N° {factura.numero_factura}",
            styles["FacturaLabel"],
        ))
        elements.append(Spacer(1, 4 * mm))

        # --- Info lines ---
        tipo_label = {"A": "Factura A (Responsable Inscripto)",
                      "B": "Factura B (Consumidor Final)",
                      "C": "Factura C (Monotributista)"}.get(factura.tipo_factura, "Factura")

        info_data = [
            ["Fecha de emisión:", factura.fecha_emision.strftime("%d/%m/%Y %H:%M UTC")],
            ["Tipo:", tipo_label],
            ["N° de Factura:", factura.numero_factura],
            ["N° de Pedido:", str(pedido.id)],
            ["Cliente:", pedido.cliente_nombre],
            ["Dirección:", pedido.direccion_snapshot],
        ]

        if factura.cuit_cliente:
            info_data.append(["CUIT:", factura.cuit_cliente])
        else:
            info_data.append(["CUIT:", "Consumidor Final"])

        info_table = Table(info_data, colWidths=[50 * mm, 110 * mm])
        info_table.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (0, -1), "Helvetica"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#4B5563")),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
            ("TOPPADDING", (0, 0), (-1, -1), 1 * mm),
        ]))
        elements.append(info_table)
        elements.append(Spacer(1, 6 * mm))

        # --- Tabla de detalles ---
        header = ["Producto", "P. Unit.", "Cant.", "Subtotal"]
        detail_rows = [header]
        for detalle in pedido.detalles:
            detail_rows.append([
                detalle.producto_nombre_snapshot,
                f"${detalle.precio_unitario_snapshot:.2f}",
                str(detalle.cantidad),
                f"${detalle.subtotal:.2f}",
            ])

        # Fila de total
        detail_rows.append(["", "", "TOTAL", f"${pedido.total:.2f}"])

        detail_table = Table(detail_rows, colWidths=[70 * mm, 30 * mm, 25 * mm, 35 * mm])
        table_style = [
            # Header row
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1E293B")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 10),
            ("ALIGN", (1, 0), (-1, -1), "CENTER"),
            ("ALIGN", (3, 0), (3, -1), "RIGHT"),
            # Data rows
            ("FONTNAME", (0, 1), (-1, -2), "Helvetica"),
            ("FONTSIZE", (0, 1), (-1, -2), 10),
            # Total row
            ("FONTNAME", (2, -1), (3, -1), "Helvetica-Bold"),
            ("FONTSIZE", (2, -1), (3, -1), 12),
            ("LINEABOVE", (2, -1), (3, -1), 1, colors.HexColor("#1E293B")),
            ("BACKGROUND", (2, -1), (3, -1), colors.HexColor("#F8FAFC")),
            # Grid
            ("GRID", (0, 0), (-1, -2), 0.5, colors.HexColor("#E2E8F0")),
            ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]
        detail_table.setStyle(TableStyle(table_style))
        elements.append(detail_table)

        elements.append(Spacer(1, 10 * mm))

        # --- Footer ---
        elements.append(Paragraph(
            "Food Store — Gracias por tu compra",
            styles["FacturaLabel"],
        ))

        doc.build(elements)
        buf.seek(0)
        return buf.read()

    @staticmethod
    def get_by_pedido(uow: UnitOfWork, pedido_id: int) -> Factura:
        factura = uow.facturas.get_by_pedido_id(pedido_id)
        if not factura:
            raise HTTPException(status_code=404, detail="Factura no encontrada para este pedido")
        return factura
