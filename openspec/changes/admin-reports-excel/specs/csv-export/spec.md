## ADDED Requirements

### Requirement: Export sales report to CSV
The system SHALL provide `GET /api/v1/reportes/ventas/csv?fecha_desde=&fecha_hasta=` that returns a `.csv` file using Python's `csv.writer` with columns: ID Pedido, Cliente, Fecha, Estado, Total, Cantidad de Items.

#### Scenario: Successful CSV download
- **WHEN** a GET request is made to `/api/v1/reportes/ventas/csv?fecha_desde=2026-01-01&fecha_hasta=2026-12-31`
- **THEN** the response SHALL have status 200
- **AND** content-type SHALL be `text/csv; charset=utf-8`
- **AND** content-disposition SHALL contain `attachment; filename="reporte-ventas-{fecha}.csv"`
- **AND** the body SHALL be a valid CSV with header row and data rows

#### Scenario: CSV file structure
- **WHEN** the CSV is opened
- **THEN** the first row SHALL contain headers: "ID Pedido", "Cliente", "Fecha", "Estado", "Total", "Cantidad de Items"
- **AND** each subsequent row SHALL correspond to one Pedido

#### Scenario: CSV with date range filter
- **WHEN** `fecha_desde` and `fecha_hasta` are provided
- **THEN** only orders within that date range SHALL be included
- **AND** the filename SHALL include the date range

#### Scenario: Empty export
- **WHEN** no orders exist in the requested date range
- **THEN** the CSV SHALL contain only the header row with no data rows
