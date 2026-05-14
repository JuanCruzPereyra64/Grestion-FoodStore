## ADDED Requirements

### Requirement: Dashboard shows revenue chart
The system SHALL display a bar chart (Recharts `BarChart`) on the dashboard showing daily revenue from the `ingresos_por_dia` stats endpoint, with date on X-axis and total on Y-axis.

#### Scenario: Revenue chart renders with data
- **WHEN** the dashboard loads and stats data is available
- **THEN** a bar chart SHALL render showing daily revenue
- **AND** each bar SHALL show the date label and amount on hover

#### Scenario: Revenue chart empty state
- **WHEN** the stats endpoint returns empty `ingresos_por_dia`
- **THEN** the chart SHALL show a "Sin datos" message or empty state

### Requirement: Dashboard shows top products chart
The system SHALL display a horizontal bar chart (Recharts `BarChart` with layout="vertical") on the dashboard showing the top 5 best-selling products by quantity.

#### Scenario: Top products chart renders
- **WHEN** the dashboard loads and stats data is available
- **THEN** a horizontal bar chart SHALL render with product names on Y-axis and quantities on X-axis

### Requirement: Dashboard has date picker filters
The system SHALL provide two date inputs (`<input type="date">`) on the dashboard for `fecha_desde` and `fecha_hasta`, and a button to refresh the stats data with the selected range.

#### Scenario: Date filters update charts
- **WHEN** the user selects a date range and clicks "Aplicar" or the date changes
- **THEN** the charts and KPIs SHALL update to reflect the new date range
- **AND** the stats API call SHALL include the new `fecha_desde` and `fecha_hasta` parameters

### Requirement: Dashboard shows KPI cards
The system SHALL display KPI cards on the dashboard showing: total pedidos in the filtered range, total ingresos in the filtered range.

#### Scenario: KPI cards display totals
- **WHEN** the dashboard loads with stats
- **THEN** a card labeled "Pedidos" SHALL show `total_pedidos`
- **AND** a card labeled "Ingresos" SHALL show `ingresos_totales` formatted as currency

### Requirement: Export to Excel button
The system SHALL provide a button labeled "Exportar a Excel" on the dashboard that triggers a download of the sales report `.xlsx` file for the currently selected date range.

#### Scenario: Export button downloads file
- **WHEN** the user clicks "Exportar a Excel"
- **THEN** the browser SHALL download an `.xlsx` file with the current date range filter applied
