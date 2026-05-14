from typing import Optional
from sqlmodel import SQLModel, Field


class TopProducto(SQLModel):
    producto_nombre: str
    cantidad_total: int
    ingresos_total: float


class IngresoPorDia(SQLModel):
    fecha: str
    total: float


class EstadisticasResponse(SQLModel):
    total_pedidos: int
    ingresos_totales: float
    ingresos_por_dia: list[IngresoPorDia]
    top_productos: list[TopProducto]
