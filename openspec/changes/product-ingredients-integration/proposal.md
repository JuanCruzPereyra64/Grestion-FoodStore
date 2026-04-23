# Proposal: Product Ingredients Integration

## Intent

Permitir la selección de ingredientes directamente durante la creación y edición de productos. Esto elimina la fricción de tener que navegar a la página de detalle para asociar ingredientes, mejorando significativamente la UX.

## Scope

### In Scope
- **Backend Schema**: Añadir `ingrediente_ids` (lista de enteros) a `ProductoCreate` y `ProductoUpdate`.
- **Backend Service**: Modificar `producto_service.create` y `producto_service.update` para persistir la relación many-to-many.
- **Frontend Types**: Actualizar la interfaz `ProductoCreate` en `hooks` y componentes.
- **Frontend UI**: Implementar un selector múltiple de ingredientes en el modal de `ProductosPage.tsx`.

### Out of Scope
- Modificación de la lógica de "stock" o cantidades (seguimos tratando ingredientes como etiquetas/asociaciones fijas).

## Capabilities

### New Capabilities
- `bulk-ingredient-assignment`: Capacidad de asignar múltiples ingredientes en una sola transacción de creación/edición.

## Approach

1. **Backend Refactor**:
   - Actualizar el esquema Pydantic para incluir el campo opcional `ingrediente_ids`.
   - En el servicio, tras crear el `Producto`, iterar sobre la lista de IDs y crear las entradas correspondientes en la tabla `producto_ingrediente`.
2. **Frontend UI Update**:
   - Cargar la lista de todos los ingredientes disponibles en `ProductosPage.tsx`.
   - Reemplazar el formulario simple por uno que incluya un grid de checkboxes o un multiselect premium para ingredientes.
   - Asegurar que el estado del formulario maneje el array de IDs.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/schemas/producto.py` | High | Cambio en la firma de datos aceptada por la API. |
| `backend/services/producto_service.py` | High | Nueva lógica de negocio para persistencia relacional. |
| `frontend/src/pages/ProductosPage.tsx` | High | Rediseño del formulario modal. |
| `frontend/src/types/` | Medium | Sincronización de tipos TypeScript. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Inconsistencia si falla un insert | Low | SQLModel/SQLAlchemy manejan transacciones atómicas si se configuran correctamente (usaremos el mismo session). |

## Rollback Plan

Revertir los cambios en los esquemas y restaurar la versión anterior del servicio.

## Success Criteria

- [ ] Un usuario puede seleccionar ingredientes al crear un producto nuevo.
- [ ] Los ingredientes seleccionados persisten y se ven en la tabla de productos inmediatamente.
- [ ] Los ingredientes pueden actualizarse desde el modal de edición.
