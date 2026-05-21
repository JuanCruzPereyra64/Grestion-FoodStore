## 1. Backend — ReporteService

- [ ] 1.1 Crear `backend/services/reporte_service.py` con clase `ReporteService`:
  - `get_estadisticas(uow, fecha_desde, fecha_hasta)` → consultas SQL para top 5 productos (PedidoDetalle JOIN Pedido), revenue por día (GROUP BY DATE(created_at)), totales
  - `generar_csv(uow, fecha_desde, fecha_hasta)` → query pedidos, escribe CSV con csv.writer + StringIO, retorna str

## 2. Backend — Router y Schemas

- [ ] 2.1 Crear `backend/schemas/reporte.py` con schemas: `EstadisticasResponse`, `IngresoPorDia`, `TopProducto`
- [ ] 2.2 Crear `backend/routers/reportes.py` con 2 endpoints:
  - `GET /reportes/estadisticas` → llama a `ReporteService.get_estadisticas()`, retorna JSON
  - `GET /reportes/ventas/csv` → llama a `ReporteService.generar_csv()`, retorna `StreamingResponse` con `.csv`
- [ ] 2.3 Incluir `reportes.router` en `backend/main.py`

## 4. Frontend — Dependencias

- [ ] 4.1 Instalar `recharts` en frontend

## 5. Frontend — API y Hooks

- [ ] 5.1 Agregar métodos `reportesApi.getEstadisticas()` y `reportesApi.descargarExcel()` a `frontend/src/services/api.ts`
- [ ] 5.2 Agregar tipos `EstadisticasResponse`, `IngresoPorDia`, `TopProducto` a `frontend/src/types/index.ts`
- [ ] 5.3 Crear `frontend/src/hooks/useReportes.ts` con `useEstadisticas(fechaDesde, fechaHasta)` hook con TanStack Query

## 6. Frontend — Dashboard con Gráficos

- [ ] 6.1 Refactorizar `frontend/src/pages/HomePage.tsx`: agregar selectores de fecha (input type date), KPI cards con total_pedidos e ingresos_totales
- [ ] 6.2 Integrar Recharts `BarChart` para revenue diario (ingresos_por_dia)
- [ ] 6.3 Integrar Recharts `BarChart` horizontal para top 5 productos (top_productos)
- [ ] 6.4 Agregar botón "Exportar a Excel" que descarga el .xlsx con filtros actuales

## 7. Verificación

- [ ] 7.1 Verificar py_compile de todos los archivos backend nuevos/modificados
- [ ] 7.2 Verificar tsc --noEmit de frontend
- [ ] 7.3 Verificar openspec status completo
