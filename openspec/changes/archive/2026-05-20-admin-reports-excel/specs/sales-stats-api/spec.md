## ADDED Requirements

### Requirement: Get sales stats with date filter
The system SHALL provide `GET /api/v1/reportes/estadisticas?fecha_desde=&fecha_hasta=` that returns a JSON object with: `total_pedidos` (count of orders in CONFIRMADO, ENTREGADO, or FACTURADO states), `ingresos_totales` (sum of all pedido.total in the range), `ingresos_por_dia` (array of `{fecha: string, total: float}` grouped by day), `top_productos` (array of `{producto_nombre: string, cantidad_total: int, ingresos_total: float}` top 5 by quantity sold).

#### Scenario: Stats with date range
- **WHEN** a GET request is made to `/api/v1/reportes/estadisticas?fecha_desde=2026-01-01&fecha_hasta=2026-12-31`
- **THEN** response SHALL be HTTP 200 with JSON containing `total_pedidos`, `ingresos_totales`, `ingresos_por_dia`, and `top_productos`
- **AND** `total_pedidos` SHALL only count orders in states CONFIRMADO, ENTREGADO, or FACTURADO

#### Scenario: Stats without date range (all time)
- **WHEN** a GET request is made to `/api/v1/reportes/estadisticas` without `fecha_desde` or `fecha_hasta`
- **THEN** response SHALL include ALL orders up to the current date

#### Scenario: Empty results
- **WHEN** a GET request is made to `/api/v1/reportes/estadisticas?fecha_desde=2020-01-01&fecha_hasta=2020-01-02` and no orders exist in that range
- **THEN** response SHALL be HTTP 200 with `total_pedidos: 0`, `ingresos_totales: 0`, empty arrays for `ingresos_por_dia` and `top_productos`

### Requirement: Top 5 products by quantity sold
The system SHALL aggregate all `PedidoDetalle` rows from confirmed/delivered orders, group by `producto_nombre_snapshot`, sum `cantidad`, and return the top 5 products ordered by `cantidad_total` descending.

#### Scenario: Top products returns 5 or fewer
- **WHEN** the stats endpoint is called
- **THEN** `top_productos` SHALL contain at most 5 entries
- **AND** each entry SHALL have `producto_nombre`, `cantidad_total`, and `ingresos_total` (sum of subtotal)

### Requirement: Revenue grouped by day
The system SHALL group confirmed/delivered orders by `created_at` date (day precision) and sum `total` per day, sorted chronologically.

#### Scenario: Revenue by day returns chronological array
- **WHEN** the stats endpoint is called
- **THEN** `ingresos_por_dia` SHALL be sorted by date ascending
- **AND** each entry SHALL contain `fecha` (ISO date string) and `total` (float)
