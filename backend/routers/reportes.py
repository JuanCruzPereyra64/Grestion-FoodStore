from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse

from backend.database import get_uow
from backend.schemas.reporte import EstadisticasResponse
from backend.services.reporte_service import ReporteService
from backend.uow.unit_of_work import UnitOfWork

router = APIRouter(prefix="/reportes", tags=["Reportes"])


@router.get("/estadisticas", response_model=EstadisticasResponse)
def get_estadisticas(
    uow: UnitOfWork = Depends(get_uow),
    fecha_desde: Optional[str] = Query(None, description="Fecha inicio (YYYY-MM-DD)"),
    fecha_hasta: Optional[str] = Query(None, description="Fecha fin (YYYY-MM-DD)"),
):
    return ReporteService.get_estadisticas(uow, fecha_desde, fecha_hasta)


@router.get("/ventas/csv")
def descargar_csv(
    uow: UnitOfWork = Depends(get_uow),
    fecha_desde: Optional[str] = Query(None, description="Fecha inicio (YYYY-MM-DD)"),
    fecha_hasta: Optional[str] = Query(None, description="Fecha fin (YYYY-MM-DD)"),
):
    csv_content = ReporteService.generar_csv(uow, fecha_desde, fecha_hasta)

    now = datetime.now().strftime("%Y%m%d")
    filename = f"reporte-ventas-{now}.csv"
    if fecha_desde and fecha_hasta:
        filename = f"reporte-ventas-{fecha_desde}_a_{fecha_hasta}.csv"

    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv; charset=utf-8",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
        },
    )
