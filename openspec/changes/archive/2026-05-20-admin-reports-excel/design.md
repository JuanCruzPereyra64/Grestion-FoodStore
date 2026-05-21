## Context

El Dashboard actual (`HomePage.tsx`) solo muestra estadísticas básicas (conteo de productos/categorías/ingredientes) y un producto destacado por precio. Los pedidos ya existen en el sistema con estados FSM (PENDIENTE → ... → ENTREGADO/FACTURADO) y tienen detalles con snapshots de precios y cantidades. Sin embargo no hay visibilidad de métricas de ventas ni exportación de datos.

## Goals / Non-Goals

**Goals:**
- Endpoint `GET /reportes/estadisticas` con filtro de fechas que devuelva top 5 productos, revenue diario, totales
- Endpoint `GET /reportes/ventas/excel` que exporte pedidos a `.xlsx` con Pandas
- Refactor de `HomePage` para incluir KPIs, gráficos Recharts, date pickers, y botón de exportación
- Agregar dependencias: `openpyxl` (backend), `recharts` (frontend)

**Non-Goals:**
- Exportación en otros formatos (CSV, PDF) — solo Excel
- Estadísticas en tiempo real (websockets) — todo es request/response
- Gráficos avanzados (pie charts, líneas) — solo barras
- Autenticación para los endpoints de reportes (se hereda del sistema existente, si aplica)
- Paginación en estadísticas (son agregaciones, no listas)

## Decisions

### 1. ReporteService como clase con métodos estáticos
**Decisión**: `ReporteService` será una clase con métodos `get_estadisticas(uow, fecha_desde, fecha_hasta)` y `generar_excel(uow, fecha_desde, fecha_hasta)`.
**Por qué**: Sigue el patrón de `FacturaService` ya establecido en el proyecto. Los métodos son stateless y reciben el UoW como dependencia.

### 2. CSV nativo con csv.writer (no Pandas ni openpyxl)
**Decisión**: Usar `csv.writer` de la stdlib de Python + `io.StringIO` en vez de Pandas DataFrame.
**Por qué**: CSV es un formato de texto simple — no necesita Pandas ni openpyxl. Usar la stdlib evita dependencias innecesarias, el código es más directo, y el resultado es 100% compatible con Excel, Google Sheets, y cualquier herramienta de análisis. `StreamingResponse` con `io.StringIO` sigue el mismo patrón que las facturas PDF.

### 3. Consultas SQL directas con text() vs SQLModel ORM
**Decisión**: Para las agregaciones (GROUP BY, SUM, COUNT), usar `session.exec(text(...))` con SQL raw en vez del ORM.
**Por qué**: Las consultas de reportes son agregaciones multi-tabla que no se benefician del ORM. SQL raw es más expresivo para GROUP BY por fecha truncada y joins agregados. El ORM se usa para el resto de la app.

### 4. Recharts sobre Chart.js
**Decisión**: Usar `recharts` (vs Chart.js + react-chartjs-2).
**Por qué**: Recharts es declarativo, se integra nativamente con React (componentes JSX), tiene mejor soporte de TypeScript, y bundle size menor. Además es consistente con el ecosistema React del proyecto.

### 5. Date inputs nativos sobre librería externa
**Decisión**: Usar `<input type="date">` nativo de HTML en vez de una librería como react-datepicker.
**Por qué**: Reducimos dependencias. Los date pickers nativos son suficientemente funcionales para este caso de uso (rango simple de fechas). Si se necesita un date range picker más pulido en el futuro, se puede agregar.

### 6. StreamingResponse con StringIO para CSV
**Decisión**: Usar `StreamingResponse` con `io.StringIO` para el CSV.
**Por qué**: CSV es texto plano. `StringIO` evita codificar/decodificar innecesariamente y permite escribir línea por línea con `csv.writer`. Se envía como `StreamingResponse` con `media_type="text/csv; charset=utf-8"`.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Caracteres especiales (tildes, ñ) en CSV | Se setea encoding UTF-8 BOM para compatibilidad con Excel |
| Consultas SQL raw pueden romper con cambios de modelo | Se aíslan en `ReporteService`, si el modelo cambia solo se toca ese archivo |
| Recharts agrega ~200KB al bundle | Es una dependencia aceptable para gráficos; se puede lazy-load si es necesario |
| Dashboard puede tardar en cargar con muchos pedidos | Las consultas tienen GROUP BY + LIMIT 5, son eficientes incluso con miles de registros |
| Fechas sin pedidos muestran gráficos vacíos | Se maneja con estados vacíos (mensaje "Sin datos en este período") |
