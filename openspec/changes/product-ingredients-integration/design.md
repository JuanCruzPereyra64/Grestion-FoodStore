# Design: Product Ingredients Integration

## Technical Approach

La integración se basa en extender la capacidad de la transacción de creación/edición de productos. En lugar de delegar la asociación de ingredientes a llamadas posteriores, el cliente enviará los IDs deseados en la carga útil inicial. El servidor se encargará de validar la existencia de estos ingredientes y vincularlos.

## architecture Decisions

### Decision: Backend Schema Update

**Choice**: Añadir `ingrediente_ids: list[int] = []` al esquema `ProductoCreate`.
**Rationale**: Es el enfoque estándar para manejar relaciones many-to-many en APIs REST pragmáticas cuando no se requiere enviar metadatos adicionales en la relación (como cantidades específicas por producto).

### Decision: Service Layer Transaction

**Choice**: Modificar `producto_service.create` para iterar y añadir a `session`.
**Rationale**: Al estar dentro del mismo bloque de servicio que maneja el commit, aseguramos que el producto no se cree sin sus ingredientes si ocurre un error catastrófico (atomicidad).

### Decision: Frontend UI Component

**Choice**: Checkboxes estilizados dentro de un grid colapsable o scrollable en el modal.
**Rationale**: Un selector tipo "tags" es visualmente superior pero los checkboxes son más fáciles de navegar masivamente si hay muchos ingredientes, y encajan bien con la estética premium si se usan custom borders y backgrounds.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/schemas/producto.py` | Modify | Añadir `ingrediente_ids` a `ProductoCreate` y `ProductoUpdate`. |
| `backend/services/producto_service.py` | Modify | Lógica para guardar `ProductoIngrediente` masivamente. |
| `frontend/src/pages/ProductosPage.tsx` | Modify | UI del modal y lógica del Mutation. |
| `frontend/src/hooks/useProductos.ts` | Modify/Verify | Asegurar que `ProductoCreate` refleje los nuevos campos si es necesario. |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| API | Creación con ingredientes | `POST /productos` con `ingrediente_ids`. |
| Frontend | Formulario | Seleccionar ingredientes y verificar que persistan tras el click en "Crear". |
| Regresión | Detail Page | Asegurar que se puedan seguir añadiendo/quitando desde el detalle. |
