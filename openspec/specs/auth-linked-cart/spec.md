# auth-linked-cart Specification

## Purpose
TBD - created by archiving change auth-linked-cart. Update Purpose after archive.
## Requirements
### Requirement: Carrito vacío sin autenticación

Cuando no hay sesión activa, el carrito SHALL comportarse como vacío independientemente de lo que haya en localStorage.

#### Scenario: Anónimo ve el navbar
- **WHEN** un usuario no autenticado navega por rutas públicas
- **THEN** el badge del carrito en el navbar muestra 0
- **AND** `useCart().items` retorna `[]`
- **AND** `useCart().totalItems` retorna 0

#### Scenario: Anónimo tenía items en localStorage antes de aplicar el cambio
- **WHEN** un usuario no autenticado tenía items guardados en localStorage de una sesión anterior
- **THEN** el carrito se muestra vacío (0 items, badge 0)
- **AND** los items en localStorage NO son accesibles desde `useCart()`

### Requirement: Logout limpia el carrito

Al cerrar sesión, el carrito SHALL vaciarse completamente incluyendo localStorage.

#### Scenario: Usuario autenticado cierra sesión
- **WHEN** un usuario autenticado con items en el carrito hace clic en "Cerrar sesión"
- **THEN** `logout()` se ejecuta
- **AND** `clearCart()` se ejecuta
- **AND** localStorage de `foodstore-cart` se elimina
- **AND** el usuario es redirigido a `/login`
- **AND** al volver a `/` (público), el badge del carrito muestra 0

### Requirement: Add-to-cart bloqueado sin sesión

Los botones "Agregar al carrito" y cualquier acción que modifique el carrito SHALL redirigir a `/login` si no hay sesión activa.

#### Scenario: Anónimo intenta agregar producto desde el catálogo
- **WHEN** un usuario no autenticado hace clic en "Agregar al carrito" en `/productos`
- **THEN** no se agrega ningún item al carrito
- **AND** el usuario es redirigido a `/login`

#### Scenario: Anónimo intenta agregar producto desde el detalle
- **WHEN** un usuario no autenticado hace clic en "Agregar al carrito" en `/productos/:id`
- **THEN** no se agrega ningún item al carrito
- **AND** el usuario es redirigido a `/login`

#### Scenario: Anónimo intenta excluir ingrediente desde el detalle
- **WHEN** un usuario no autenticado hace clic en toggle de ingrediente en `/productos/:id`
- **THEN** no se modifica el carrito
- **AND** el usuario es redirigido a `/login`

### Requirement: Carrito funcional con sesión activa

Cuando hay sesión activa, el carrito SHALL funcionar exactamente como antes.

#### Scenario: Usuario autenticado agrega productos
- **WHEN** un usuario autenticado hace clic en "Agregar al carrito"
- **THEN** el producto se agrega al carrito normalmente
- **AND** el badge se actualiza
- **AND** los datos persisten en localStorage

