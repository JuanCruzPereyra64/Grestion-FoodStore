## Why

La vista de detalle de producto para el cliente (`/productos/:id`) está heredando componentes y lógica del panel de administración: muestra cantidades técnicas de ingredientes (gramos, unidades), tiene controles de receta (añadir/remover ingredientes) que no corresponden al cliente, y el badge de stock se calculaba incorrectamente porque `stock_cantidad` es un campo manual que siempre da 0.

## What Changes

1. **Refactor de la lista de ingredientes (columna derecha):**
   - Ocultar cantidades técnicas (`{cantidad_requerida}{unidad_medida}`) — el cliente no necesita ver la receta
   - Mantener badge de alérgeno (útil para el cliente)
   - Simplificar la interacción: el botón de exclusión de ingrediente ("X" / check) se vuelve permanente (no solo cuando hay cartItem), permitiendo al cliente personalizar su pedido incluso antes de agregarlo al carrito

2. **Eliminar controles de administración:**
   - Remover la sección "Añadir a la receta" (select + botón "Agregar Ingrediente")
   - Remover el botón de tacho (Trash2) para quitar ingredientes de la receta
   - Mantener solo la interacción de exclusión para personalización del carrito

3. **Consolidar el Call to Action:**
   - Dejar el botón "Agregar al carrito" como la única acción principal
   - Ajustar layout al eliminar los controles admin

4. **Corrección de stock (ya implementado en backend, verificar integración frontend):**
   - El campo `puede_prepararse` en `ProductoRead` ya computa disponibilidad desde `ingrediente.stock`
   - El frontend ya usa `puede_prepararse` en el badge (cambio previo)
   - Asegurar que el botón "Agregar al carrito" se deshabilite cuando `puede_prepararse = false`

5. **Estilos consistencia dark-mode:**
   - Nombres de ingredientes ya están en `dark:text-white` (cambio previo)
   - Verificar que todos los textos en la tarjeta cumplan la regla

## Capabilities

### New Capabilities
- `client-product-detail`: Vista de detalle de producto optimizada para cliente consumidor — ingredientes legibles, personalización por exclusión, CTA claro, stock dinámico basado en inventario real

### Modified Capabilities
<!-- None — no global specs exist yet in openspec/specs/ -->

## Impact

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/pages/ProductoDetallePage.tsx` | Modified | Refactor completo: remover controles admin, ocultar cantidades, simplificar UI |
| `frontend/src/types/index.ts` | None | Ya incluye `puede_prepararse` y `stock_disponible` |
| `backend/schemas/producto.py` | None | `puede_prepararse` ya implementado |
| `backend/services/producto_service.py` | None | Lógica de stock dinámico ya implementada |
