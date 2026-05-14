# Design: Client Product Card Fix

## Context

`ProductoDetallePage.tsx` es un componente que se comparte entre cliente y admin (mezclado en la misma vista). La columna derecha de ingredientes tiene controles de administración de receta (añadir/remover ingredientes, cantidades técnicas) que no corresponden al cliente. Además, el badge de stock usaba `stock_cantidad` (campo manual, siempre 0) en vez de calcular disponibilidad real desde `ingrediente.stock`.

El backend ya tiene el endpoint con `puede_prepararse` computado desde `ingrediente.stock`. Solo falta ajustar el frontend.

## Goals / Non-Goals

**Goals:**
- Separar la vista de detalle de producto en una versión limpia para cliente
- Ocultar datos técnicos de receta (cantidades en g, unidades)
- Eliminar controles de administración de la vista cliente
- Convertir la exclusión de ingredientes en interacción permanente del cliente (no condicional a tener un cartItem)
- Deshabilitar "Agregar al carrito" si `puede_prepararse = false`
- Aplicar regla `dark:text-white` consistente

**Non-Goals:**
- No tocar el backend (ya está implementado)
- No crear un componente separado (es el mismo archivo, solo se limpia)
- No cambiar el layout responsive (sigue grid de 3 columnas)

## Decisions

### DEC-001: Exclusión permanente de ingredientes
- **Qué**: El toggle de exclusión de ingredientes ("X" / check) actualmente solo aparece cuando el producto ya está en el carrito (`cartItem` exists). Se cambia para que aparezca SIEMPRE.
- **Por qué**: El cliente debe poder personalizar su pedido (ej: "sin cebolla") incluso antes de agregarlo al carrito. La experiencia de compra espera ver qué puede sacar.
- **Cómo**: Cuando no hay `cartItem`, el toggle agrega el producto al carrito con el ingrediente excluido (`cart.addItem(p.id, 1, [ing.ingrediente_id])`). Cuando ya está en el carrito, alterna como antes.

### DEC-002: Eliminar controles admin de receta
- **Qué**: Se remueve la sección "Añadir a la receta" (select + botón "Agregar Ingrediente") y el botón Trash2 de cada ingrediente.
- **Por qué**: Esos controles modifican la receta del producto (alta de BD), operación exclusiva de administración.
- **Cómo**: Se eliminan los JSX correspondientes. También se eliminan los imports y hooks de `useAddIngrediente`, `useRemoveIngrediente`, `useIngredientes` que ya no se necesitan.

### DEC-003: Botón "Agregar al carrito" deshabilitado sin stock
- **Qué**: El botón se deshabilita (`disabled`) cuando `p.puede_prepararse === false`.
- **Por qué**: Si no hay ingredientes suficientes para armar el producto, no tiene sentido permitir agregarlo al carrito.
- **Cómo**: `disabled={!p.puede_prepararse}` en el Button, con estilo visual atenuado.

### DEC-004: Ocultar cantidades técnicas
- **Qué**: Se elimina el span que muestra `{ing.cantidad_requerida}{ing.unidad_medida}`.
- **Por qué**: Al cliente no le interesa si son 200g o 1 unidad. Solo quiere saber los ingredientes y si puede sacar alguno.

### DEC-005: Simplificar imports
- **Qué**: Se eliminan `useAddIngrediente`, `useRemoveIngrediente`, `useIngredientes`, `Plus`, `Trash2` y el `useState` de `ingredienteSeleccionado`.
- **Por qué**: Ya no se usan en la vista cliente. Se mantiene `motion` para animaciones y `AlertTriangle` para alérgenos.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Que un cliente excluya tantos ingredientes que el producto quede irreconocible | El negocio ya definió `es_removible` en cada ingrediente, pero actualmente el frontend no lo respeta. No se aborda en este change. |
| Perder la funcionalidad de administración de recetas | No se pierde — los hooks y componentes admin existen en el código, solo se limpian de la vista cliente. Si en el futuro se necesita una página admin de detalle de producto, se puede crear desde cero. |
| Que el botón deshabilitado confunda al cliente | Se muestra el badge "Sin stock" en rojo, que ya comunica visualmente por qué no puede agregarlo. |
