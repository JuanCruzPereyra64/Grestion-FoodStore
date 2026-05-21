# ingredient-local-selection Specification

## Purpose
TBD - created by archiving change ingredient-selection-cart-fix. Update Purpose after archive.
## Requirements
### Requirement: Selección de ingredientes en estado local

La vista de detalle de producto (`/productos/:id`) SHALL manejar la exclusión de ingredientes mediante estado `useState<number[]>` local, completamente desvinculado del `cartStore` hasta que el usuario ejecute la acción explícita de "Agregar al carrito".

#### Scenario: Usuario excluye ingrediente sin sesión
- **WHEN** un usuario (autenticado o no) hace clic en el ícono de tacho de un ingrediente en `/productos/:id`
- **THEN** el ingrediente se marca como excluido visualmente (opacidad reducida, tachado)
- **AND** el estado local `excludedIngredients` se actualiza con el ID del ingrediente
- **AND** NO se modifica el `cartStore`
- **AND** NO hay redirección a `/login`

#### Scenario: Usuario revierte exclusión
- **WHEN** el usuario hace clic en el ícono de suma/restaurar de un ingrediente excluido
- **THEN** el ingrediente vuelve a su estado normal (opacidad completa, sin tachado)
- **AND** el ID del ingrediente se elimina del `excludedIngredients` local

#### Scenario: Usuario agrega al carrito con ingredientes excluidos
- **WHEN** el usuario hace clic en "Agregar al carrito" después de haber excluido ingredientes
- **THEN** el producto se agrega al `cartStore` con el array `excludedIngredienteIds` conteniendo los IDs de ingredientes excluidos
- **AND** el estado local `excludedIngredients` NO se modifica (persiste visualmente)

#### Scenario: Usuario sale y vuelve a la página de detalle
- **WHEN** el usuario navega a otra ruta y luego regresa a `/productos/:id`
- **THEN** el estado local `excludedIngredients` se reinicia a `[]`
- **AND** el carrito mantiene el estado anterior (con las exclusiones previas si las había)

### Requirement: Estados visuales de ingredientes

Cada ingrediente en la lista SHALL mostrar un estado visual claro y semánticamente correcto según su estado de inclusión.

#### Scenario: Ingrediente incluido (por defecto)
- **WHEN** un ingrediente NO está en `excludedIngredients`
- **THEN** el texto se muestra con opacidad normal (`opacity-100`), color blanco
- **AND** el botón a la derecha muestra un ícono de tacho rojo (`Trash2`) con tooltip "Excluir ingrediente"

#### Scenario: Ingrediente excluido
- **WHEN** un ingrediente ESTÁ en `excludedIngredients`
- **THEN** el contenedor se muestra con opacidad reducida (`opacity-50`)
- **AND** el texto se muestra tachado (`line-through`, `text-gray-500`)
- **AND** el botón a la derecha muestra un ícono de suma (`Plus`) gris/verde tenue con tooltip "Incluir ingrediente"

### Requirement: Botón "Agregar al carrito" como única acción de escritura en carrito

El botón principal naranja "Agregar al carrito" SHALL ser el único mecanismo para añadir/modificar items en el `cartStore` desde la vista de detalle.

#### Scenario: Producto no está en el carrito
- **WHEN** el usuario hace clic en "Agregar al carrito"
- **THEN** se llama a `cart.addItem(producto, 1, excludedIngredients)`
- **AND** el flag local `hasAddedToCart` se establece en `true`
- **AND** los controles de cantidad (`- 1 +`) aparecen
- **AND** el texto del botón cambia a "Agregar otro"

#### Scenario: Producto ya está en el carrito (primera adición en esta sesión)
- **WHEN** el usuario hace clic en "Agregar al carrito" y el producto YA existe en el carrito
- **THEN** se actualizan las exclusiones del item existente con los valores actuales de `excludedIngredients`
- **AND** la cantidad se incrementa en 1
- **AND** el flag `hasAddedToCart` se establece en `true`
- **AND** los controles de cantidad aparecen

#### Scenario: Recarga de página con producto en carrito
- **WHEN** el usuario recarga la página y el producto ya estaba en el carrito
- **THEN** el flag `hasAddedToCart` está en `false` (se reinicia con el estado local)
- **AND** el botón muestra "Agregar al carrito" en vez de controles de cantidad
- **AND** el texto informativo muestra que el producto está en el carrito
- **AND** al clickear "Agregar al carrito" se incrementa la cantidad y aparecen los controles

