# Tasks: Product Ingredients Integration

## Phase 1: Backend Implementation

- [ ] 1.1 Actualizar `backend/schemas/producto.py`: Añadir `ingrediente_ids` a `ProductoCreate` y `ProductoUpdate`.
- [ ] 1.2 Modificar `backend/services/producto_service.py`: 
    - [ ] Actualizar `create` para insertar en `ProductoIngrediente`.
    - [ ] Actualizar `update` para sincronizar ingredientes (quitar antiguos, añadir nuevos).

## Phase 2: Frontend Types & Hooks

- [ ] 2.1 Verificar/Actualizar tipos en `frontend/src/types` para incluir `ingrediente_ids`.
- [ ] 2.2 Asegurar que el hook `useCreateProducto` y `useUpdateProducto` maneje correctamente los nuevos campos.

## Phase 3: UI Redesign (ProductosPage)

- [ ] 3.1 Cargar lista de ingredientes disponibles en `ProductosPage.tsx` usando `useIngredientes`.
- [ ] 3.2 Implementar el selector múltiple de ingredientes en el Modal (Diseño Premium).
- [ ] 3.3 Vincular el estado del formulario con el selector de ingredientes.
- [ ] 3.4 Actualizar la lógica de `openEdit` para precargar los ingredientes existentes del producto.

## Phase 4: Verification

- [ ] 4.1 Crear un producto con ingredientes y verificar persistencia.
- [ ] 4.2 Editar un producto cambiando sus ingredientes y verificar sincronización.
- [ ] 4.3 Verificación de build final.
