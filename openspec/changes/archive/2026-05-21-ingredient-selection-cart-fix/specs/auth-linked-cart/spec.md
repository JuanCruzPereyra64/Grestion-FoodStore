# auth-linked-cart Specification — Delta

## MODIFIED Requirements

### Requirement: Add-to-cart bloqueado sin sesión

Los botones "Agregar al carrito" y cualquier acción que modifique el carrito SHALL redirigir a `/login` si no hay sesión activa. La exclusión de ingredientes en la vista de detalle NO modifica el carrito y SHALL estar disponible sin autenticación.

#### Scenario: Anónimo intenta agregar producto desde el catálogo
- **WHEN** un usuario no autenticado hace clic en "Agregar al carrito" en `/productos`
- **THEN** no se agrega ningún item al carrito
- **AND** el usuario es redirigido a `/login`

#### Scenario: Anónimo intenta agregar producto desde el detalle
- **WHEN** un usuario no autenticado hace clic en "Agregar al carrito" en `/productos/:id`
- **THEN** no se agrega ningún item al carrito
- **AND** el usuario es redirigido a `/login`

#### Scenario: Anónimo interactúa con ingredientes desde el detalle
- **WHEN** un usuario no autenticado hace clic en toggle de ingrediente en `/productos/:id`
- **THEN** el ingrediente se marca como excluido/incluido visualmente (estado local únicamente)
- **AND** NO se modifica el carrito
- **AND** NO hay redirección a `/login`
