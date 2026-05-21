# Design: Product Card Layout Optimization

## Context

`ProductoDetallePage.tsx` tiene el CTA (botón "Agregar al carrito") en la columna izquierda, separado de la lista de ingredientes que está en la columna derecha. El usuario tiene que cruzar visualmente entre columnas para configurar su pedido y luego comprar. Además, el botón de exclusión de ingredientes dice "Sacar" en texto, ocupando espacio.

## Goals / Non-Goals

**Goals:**
- Reemplazar botón de texto "Sacar" por ícono `Trash2` rojo en cada ingrediente
- Mover el botón "Agregar al carrito" + controles de cantidad a la columna derecha, debajo de ingredientes
- Eliminar el Card inferior de CTA de la columna izquierda
- Mantener flujo vertical: ver ingredientes → personalizar (excluir) → comprar

**Non-Goals:**
- No tocar la columna izquierda (imagen, descripción, precio, badge de stock)
- No cambiar el backend
- No cambiar funcionalidad del carrito

## Decisions

### DEC-001: Trash2 icon en vez de texto "Sacar"
- **Qué**: El botón con texto "Sacar" cambia a un ícono `Trash2` de lucide-react, color `text-red-500`.
- **Por qué**: El ícono es universalmente reconocido como "eliminar", ocupa menos espacio, y el rojo indica claramente una acción destructiva. Es más intuitivo que leer texto.
- **Alternativa considerada**: Un SVG custom — descartado, ya tenemos lucide-react en el proyecto.

### DEC-002: CTA se mueve al final de la columna derecha
- **Qué**: El Card de CTA se elimina de la columna izquierda. El botón "Agregar al carrito" se coloca dentro de la tarjeta de ingredientes, al final, con ancho completo.
- **Por qué**: Flujo vertical natural — el usuario ve los ingredientes, excluye los que no quiere, y el botón de compra está justo abajo. No tiene que saltar entre columnas.
- **Cómo**: El botón va dentro del mismo `Card` de ingredientes, después del `<ul>` de ingredientes, separado con un `border-t`. Incluye el texto informativo y los controles de cantidad (+/−) cuando el producto ya está en el carrito.

### DEC-003: Cantidad stepper y CTA juntos
- **Qué**: Los controles de cantidad (+/−) y el botón "Agregar al carrito" se mantienen juntos en el mismo contenedor, apilados si es necesario para mobile.
- **Por qué**: Es la misma función de compra, no tiene sentido separarlos.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| En mobile, la columna derecha se apila debajo de la izquierda — el orden sigue siendo natural | El grid ya es `grid-cols-1 lg:grid-cols-3`, así que en mobile queda imagen → descripción → ingredientes → compra, que es correcto |
| Que el botón quede "escondido" si la lista de ingredientes es muy larga | El botón está justo debajo del último ingrediente, siempre visible al scrollear |
