# routing-verification Specification

## Purpose
TBD - created by archiving change force-absolute-routing. Update Purpose after archive.
## Requirements
### Requirement: "Volver a Productos" usa enlace absoluto

The "Volver a Productos" button SHALL use `<Link to="/productos">` without any `router.back()` or `history.go()`.

#### Scenario: Click navega directamente al catálogo

- **WHEN** el usuario hace clic en "Volver a Productos"
- **THEN** la URL cambia a `/productos`
- **AND** el catálogo de productos se renderiza correctamente

### Requirement: Logo navega al catálogo

The logo "DISTRITO FOOD" SHALL be wrapped in `<Link to="/productos">`.

#### Scenario: Click en logo navega a productos

- **WHEN** el usuario hace clic en "DISTRITO FOOD"
- **THEN** la URL cambia a `/productos`
- **AND** el catálogo de productos se renderiza correctamente

