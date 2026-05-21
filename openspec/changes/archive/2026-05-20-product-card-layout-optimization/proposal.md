## Why

El layout actual del detalle de producto tiene el botón "Agregar al carrito" en la columna izquierda, separado de la lista de ingredientes que está en la columna derecha. Esto obliga al usuario a moverse visualmente entre columnas para configurar su pedido (excluir ingredientes) y luego comprar. Además, el botón de exclusión de ingredientes muestra texto ("Sacar") que ocupa espacio innecesario y no es intuitivo.

## What Changes

1. **Reemplazar texto "Sacar" por ícono de tacho rojo**: Cambiar el botón con texto "Sacar" / "Excluido" por un ícono `Trash2` en color rojo (`text-red-500`) en la lista de ingredientes. El ícono es universalmente reconocido y ocupa menos espacio.

2. **Eliminar sección inferior de compra (columna izquierda)**: Remover el Card completo que contiene "¿Listo para pedir?", el texto informativo, los botones de cantidad (+/−) y el botón naranja "Agregar al carrito".

3. **Mover botón de compra a la columna derecha**: Reubicar el botón "Agregar al carrito" (con sus controles de cantidad +/− cuando el producto ya está en el carrito) debajo de la lista de ingredientes, dentro de la misma columna derecha. El botón debe ocupar el ancho completo de la tarjeta de ingredientes.

## Capabilities

### New Capabilities
- `client-product-layout`: Layout optimizado del detalle de producto para cliente — flujo vertical: ingredientes → personalización → compra

### Modified Capabilities
<!-- No se modifican specs existentes — `client-product-detail` se actualiza con los nuevos requirements -->

## Impact

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/pages/ProductoDetallePage.tsx` | Modified | Reubicar CTA, cambiar botones "Sacar" por Trash2, eliminar Card inferior |
