## Why

En la vista de detalle de producto (`ProductoDetallePage`), interactuar con los botones para excluir ingredientes dispara erróneamente la acción de agregar el producto al carrito. Además, la respuesta visual al excluir un ingrediente (ícono de check ✓) es semánticamente incorrecta — un check sugiere "incluido", no "excluido". Esto genera una experiencia confusa y bugs funcionales donde el producto aparece en el carrito sin que el usuario lo haya solicitado explícitamente.

## What Changes

- **Separar estado de selección local del carrito global**: La exclusión de ingredientes se maneja en estado `useState` local del componente, NO en el `cartStore`. El store del carrito solo se toca cuando el usuario hace clic en "Agregar al carrito".
- **Corregir semántica visual de ingredientes excluidos**: En lugar del checkmark actual → opacidad reducida (`opacity-50`), texto tachado (`line-through text-gray-500`). El botón cambia de tacho rojo (quitar) a ícono suma verde/gris (volver a incluir).
- **Desvincular toggle de ingrediente del carrito**: `handleToggleExclude` ya no llama a `cart.addItem` ni a `cart.toggleExcludeIngrediente`. Solo actualiza el `excludedIngredients` local.
- **Botón "Agregar al carrito" como única acción de compra**: El botón principal naranja es el ÚNICO que envía el producto (con el array de `excludedIngredients`) al `cartStore`.
- **Controles de cantidad post-agregado**: Los botones `- 1 +` y el texto "Agregar otro" aparecen SOLO después de que el usuario presionó "Agregar al carrito" explícitamente para esa sesión de vista.
- **Event bubbling**: Agregar `e.stopPropagation()` y `e.preventDefault()` en handlers de ingredientes.

## Capabilities

### New Capabilities
- `ingredient-local-selection`: Manejo de selección/exclusión de ingredientes en estado local del componente, completamente desvinculado del carrito hasta la acción explícita de compra.

### Modified Capabilities
- `auth-linked-cart`: El carrito ya no recibe escrituras indirectas desde la selección de ingredientes. La acción de "Agregar al carrito" es la única puerta de entrada.
- `public-catalog`: La vista de detalle de producto cambia su comportamiento de ingredientes y flujo de agregado al carrito.

## Impact

- **Frontend**: `frontend/src/pages/ProductoDetallePage.tsx` — refactor completo del manejo de estado de ingredientes y del botón CTA.
- **Store**: `frontend/src/stores/cartStore.tsx` — el método `toggleExcludeIngrediente` podría dejar de usarse desde `ProductoDetallePage` (se reemplaza por estado local).
- **Types**: No se modifican tipos. El `CartItem.excludedIngredienteIds` se sigue usando, pero solo se escribe al hacer clic en "Agregar al carrito".
