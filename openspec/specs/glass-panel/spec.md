# glass-panel Specification

## Purpose
TBD - created by archiving change immersive-hero-blur-overlay. Update Purpose after archive.
## Requirements
### Requirement: Panel de vidrio oscuro envolvente

All content in ClientHomePage SHALL be wrapped in a container with `bg-black/60 backdrop-blur-md min-h-screen`.

#### Scenario: Panel visible en el home

- **WHEN** el usuario carga la página de inicio
- **THEN** todo el contenido está dentro de un panel oscuro translúcido
- **AND** el panel tiene efecto de desenfoque (`backdrop-blur-md`)

### Requirement: Texto con contraste máximo

The hero description text SHALL use `text-white` for maximum contrast against the dark overlay.

#### Scenario: Texto legible

- **WHEN** el usuario ve el hero
- **THEN** el texto descriptivo tiene color `text-white`

