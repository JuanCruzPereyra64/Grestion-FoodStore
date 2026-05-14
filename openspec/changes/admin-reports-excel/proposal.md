## Why

El Dashboard actual de HomePage solo muestra estadísticas básicas (cantidad de productos, categorías, ingredientes) y un producto destacado. No hay visibilidad de ventas, ingresos, ni productos más vendidos. El administrador no puede exportar reportes. Esta feature agrega endpoints de estadísticas con filtros de fecha, exportación a CSV, y gráficos en el frontend para tomar decisiones basadas en datos.

## What Changes

- **Backend — Endpoint estadísticas**: `GET /api/v1/reportes/estadisticas?fecha_desde=&fecha_hasta=` que devuelva JSON con:
  - Total de pedidos completados (CONFIRMADO + ENTREGADO + FACTURADO)
  - Ingresos totales en el rango
  - Ingresos agrupados por día (array de {fecha, total})
  - Top 5 productos más vendidos (por cantidad total en PedidoDetalle)
- **Backend — Endpoint exportación CSV**: `GET /api/v1/reportes/ventas/csv?fecha_desde=&fecha_hasta=` que retorne un `.csv` con las filas de pedidos usando `session.exec()` + `csv.writer` con `StreamingResponse`.
- **Frontend — Librería**: Instalar `recharts` para gráficos.
- **Frontend — Dashboard refactor**: Reemplazar `HomePage` por un dashboard con:
  - Selectores de fecha (date inputs)
  - Gráfico de barras para revenue diario
  - Gráfico de barras horizontal para top 5 productos
  - KPI cards con totales (pedidos, ingresos)
  - Botón "Exportar a CSV" que descarga el `.csv`
- **Frontend — Hooks y API**: Nuevo hook `useReportes` y métodos en `api.ts`.

## Capabilities

### New Capabilities
- `sales-stats-api`: Endpoints de estadísticas de ventas con filtros de fecha y agrupación.
- `csv-export`: Exportación de reporte de ventas a CSV.
- `dashboard-charts`: Gráficos de revenue y top productos en el dashboard con Recharts.

### Modified Capabilities
- Ninguna — no se modifican specs existentes.

## Impact

| Area | Impact | Description |
|------|--------|-------------|
| `backend/services/reporte_service.py` | New | Lógica de estadísticas con SQLModel queries y generación de CSV con csv.writer |
| `backend/routers/reportes.py` | New | Router con 2 endpoints (GET /estadisticas, GET /ventas/csv) |
| `backend/main.py` | Low | Importar e incluir router |
| `frontend/package.json` | Low | +`recharts` |
| `frontend/src/services/api.ts` | Medium | +`reportesApi` con getEstadisticas, descargarCSV |
| `frontend/src/hooks/useReportes.ts` | New | Hook con TanStack Query para estadísticas |
| `frontend/src/pages/HomePage.tsx` | High | Refactor completo: KPIs, gráficos (Recharts BarChart), date pickers, botón exportar CSV |
