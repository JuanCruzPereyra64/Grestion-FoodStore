import csv
import io
from datetime import date, datetime
from typing import Optional

from sqlalchemy import text

from backend.schemas.reporte import (
    EstadisticasResponse,
    IngresoPorDia,
    TopProducto,
)
from backend.uow.unit_of_work import UnitOfWork

# Estados que se consideran "completados" para reportes
ESTADOS_COMPLETADOS = ("CONFIRMADO", "ENTREGADO", "FACTURADO")


class ReporteService:

    @staticmethod
    def _build_fecha_filtro(fecha_desde: Optional[str], fecha_hasta: Optional[str]) -> str:
        clauses = []
        if fecha_desde:
            clauses.append(f"AND p.created_at >= '{fecha_desde}'::timestamp")
        if fecha_hasta:
            # inclusive: hasta el final del día
            clauses.append(f"AND p.created_at < ('{fecha_hasta}'::date + INTERVAL '1 day')")
        return " ".join(clauses)

    @staticmethod
    def get_estadisticas(
        uow: UnitOfWork,
        fecha_desde: Optional[str] = None,
        fecha_hasta: Optional[str] = None,
    ) -> EstadisticasResponse:
        filtro = ReporteService._build_fecha_filtro(fecha_desde, fecha_hasta)

        # --- Totals ---
        sql_totals = f"""
            SELECT
                COUNT(p.id) AS total_pedidos,
                COALESCE(SUM(p.total), 0) AS ingresos_totales
            FROM pedidos p
            WHERE p.estado IN {ESTADOS_COMPLETADOS}
            {filtro}
        """
        row = uow.session.exec(text(sql_totals)).one()
        total_pedidos = row[0]
        ingresos_totales = float(row[1])

        # --- Revenue by day ---
        sql_diario = f"""
            SELECT
                DATE(p.created_at) AS fecha,
                SUM(p.total) AS total
            FROM pedidos p
            WHERE p.estado IN {ESTADOS_COMPLETADOS}
            {filtro}
            GROUP BY DATE(p.created_at)
            ORDER BY fecha ASC
        """
        rows = uow.session.exec(text(sql_diario)).all()
        ingresos_por_dia = [
            IngresoPorDia(fecha=str(r[0]), total=float(r[1]))
            for r in rows
        ]

        # --- Top 5 products ---
        sql_top = f"""
            SELECT
                pd.producto_nombre_snapshot AS producto_nombre,
                SUM(pd.cantidad) AS cantidad_total,
                SUM(pd.subtotal) AS ingresos_total
            FROM pedido_detalles pd
            JOIN pedidos p ON p.id = pd.pedido_id
            WHERE p.estado IN {ESTADOS_COMPLETADOS}
            {filtro}
            GROUP BY pd.producto_nombre_snapshot
            ORDER BY cantidad_total DESC
            LIMIT 5
        """
        rows = uow.session.exec(text(sql_top)).all()
        top_productos = [
            TopProducto(
                producto_nombre=r[0],
                cantidad_total=int(r[1]),
                ingresos_total=float(r[2]),
            )
            for r in rows
        ]

        return EstadisticasResponse(
            total_pedidos=total_pedidos,
            ingresos_totales=ingresos_totales,
            ingresos_por_dia=ingresos_por_dia,
            top_productos=top_productos,
        )

    @staticmethod
    def generar_csv(
        uow: UnitOfWork,
        fecha_desde: Optional[str] = None,
        fecha_hasta: Optional[str] = None,
    ) -> str:
        filtro = ReporteService._build_fecha_filtro(fecha_desde, fecha_hasta)

        sql = f"""
            SELECT
                p.id,
                p.cliente_nombre,
                p.created_at,
                p.estado,
                p.total,
                (SELECT COUNT(*) FROM pedido_detalles pd WHERE pd.pedido_id = p.id) AS cantidad_items
            FROM pedidos p
            WHERE p.estado IN {ESTADOS_COMPLETADOS}
            {filtro}
            ORDER BY p.created_at DESC
        """
        rows = uow.session.exec(text(sql)).all()

        output = io.StringIO()
        writer = csv.writer(output)

        # BOM para que Excel detecte UTF-8
        output.write("\ufeff")

        writer.writerow(["ID Pedido", "Cliente", "Fecha", "Estado", "Total", "Cantidad de Items"])
        for r in rows:
            fecha_str = r[2].strftime("%Y-%m-%d %H:%M") if isinstance(r[2], datetime) else str(r[2])
            writer.writerow([
                r[0],
                r[1],
                fecha_str,
                r[3],
                f"{float(r[4]):.2f}",
                int(r[5]),
            ])

        return output.getvalue()
