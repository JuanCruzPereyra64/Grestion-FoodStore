# public-catalog Specification — Delta

## MODIFIED Requirements

### Requirement: Detalle de producto público

La ruta `/productos/:id` SHALL mostrar el detalle del producto sin redirigir a `/login`. Los ingredientes son interactivos (se pueden excluir/incluir visualmente) incluso sin sesión, pero "Agregar al carrito" requiere autenticación.

#### Scenario: Visitante anónimo ve detalle de producto
- **WHEN** un usuario no autenticado navega a `/productos/1`
- **THEN** ve la página de detalle con ingredientes, precio, imagen y botón "Agregar al carrito"
- **AND** puede interactuar con los ingredientes (excluir/incluir visualmente)
- **AND** NO es redirigido a `/login`
- **AND** al hacer clic en "Agregar al carrito" es redirigido a `/login`
