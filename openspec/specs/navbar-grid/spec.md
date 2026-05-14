# navbar-grid Specification

## Purpose
TBD - created by archiving change critical-navbar-routing-fix. Update Purpose after archive.
## Requirements
### Requirement: Navbar con layout grid-cols-3

El contenedor principal del navbar MUST usar `grid grid-cols-3` para distribuir las 3 secciones horizontalmente.

#### Scenario: Tres columnas iguales visibles en desktop

- **WHEN** el navbar se renderiza en desktop
- **THEN** el layout usa `grid grid-cols-3`
- **AND** cada columna ocupa el mismo ancho

### Requirement: Columna izquierda solo avatar

La primera columna MUST contener únicamente el avatar/dropdown de usuario, alineado a la izquierda con `justify-self-start`.

#### Scenario: Avatar en la izquierda

- **WHEN** el navbar se renderiza
- **THEN** el avatar de usuario está en el extremo izquierdo de la primera columna
- **AND** no hay otros elementos en la primera columna

### Requirement: Columna central con enlaces y logo agrupados

La segunda columna MUST contener un contenedor flex con `justify-center items-center gap-8` que incluya en este orden: "Conocenos", "Productos", logo "DISTRITO FOOD", "Descuentos", "Envíos".

#### Scenario: Enlaces y logo centrados en la columna media

- **WHEN** el navbar se renderiza en desktop
- **THEN** "Conocenos" y "Productos" están a la izquierda del logo
- **AND** "Descuentos" y "Envíos" están a la derecha del logo
- **AND** todos los elementos están centrados con `gap-8`

### Requirement: Columna derecha vacía como balance

La tercera columna MUST ser un div vacío invisible que equilibra visualmente el espacio tomado por el avatar en la primera columna.

#### Scenario: Espacio balanceado

- **WHEN** el navbar se renderiza
- **THEN** hay una tercera columna vacía
- **AND** el espacio vacío a la derecha es igual al espacio ocupado por el avatar a la izquierda

