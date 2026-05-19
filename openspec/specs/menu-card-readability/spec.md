# menu-card-readability Specification

## Purpose
TBD - created by archiving change menu-card-readability-hotfix. Update Purpose after archive.
## Requirements
### Requirement: Fondo oscuro con desenfoque en grid cards

El contenedor principal de cada card en el grid SHALL usar un fondo oscuro translúcido con desenfoque (`bg-neutral-950/80 backdrop-blur-lg`) para aislar el contenido del fondo de la página.

#### Scenario: Card en grid tiene fondo protector
- **WHEN** se renderiza cualquier card en `/productos`
- **THEN** el contenedor principal tiene `bg-neutral-950/80 backdrop-blur-lg`
- **AND** el contenido textual es legible contra el fondo de ladrillos

### Requirement: Panel de contenido aislado

El área de texto (nombre, precio, descripción, ingredientes, botón) SHALL tener su propio fondo oscuro con desenfoque que se superponga ligeramente a la imagen.

#### Scenario: Panel de texto se superpone a la imagen
- **WHEN** se renderiza una card en `/productos`
- **THEN** el `div.p-5` tiene `bg-black/60 backdrop-blur-md`
- **AND** se extiende hacia arriba con `-mt-8 pt-12` para cubrir la transición imagen-texto

### Requirement: Textos secundarios legibles

Las descripciones y conteos de ingredientes SHALL usar colores con contraste suficiente contra el fondo oscuro.

#### Scenario: Descripción legible
- **WHEN** se renderiza una descripción de producto
- **THEN** usa `text-gray-300` (no `text-slate-400`)

#### Scenario: Conteo de ingredientes legible
- **WHEN** se renderiza el conteo de ingredientes
- **THEN** usa `text-slate-400` (no `text-slate-500`)

### Requirement: Safety net global en premium-card

La clase `.premium-card` en el CSS global SHALL incluir `backdrop-blur-lg` para proteger cualquier card que se renderice sobre el fondo de ladrillos.

#### Scenario: Cards de detalle protegidas
- **WHEN** se renderiza cualquier componente que use `className="premium-card"`
- **THEN** incluye `backdrop-blur-lg`
- **AND** cualquier texto dentro es legible contra el fondo

