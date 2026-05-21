## Context

`ProductoDetallePage.tsx` actualmente usa el `cartStore` como fuente de verdad para la exclusión de ingredientes. Cuando el usuario hace clic en el tacho de un ingrediente, el handler `handleToggleExclude` llama directo al store:

- Si el producto NO está en el carrito → `cart.addItem(p, 1, [ingredienteId])` — esto AGREGA el producto al carrito sin consentimiento explícito.
- Si el producto YA está en el carrito → `cart.toggleExcludeIngrediente(p.id, ingredienteId)` — muta el carrito.

Además, el botón CTA ("Agregar al carrito") se transforma en controles de cantidad (`- 1 +`) apenas el producto está en el carrito, que sucede inmediatamente al tocar un ingrediente. Esto es un bug funcional y de UX.

## Goals / Non-Goals

**Goals:**
- Separar la selección de ingredientes en estado `useState` local del componente.
- El botón "Agregar al carrito" es la ÚNICA vía para escribir en `cartStore`.
- Visual de ingrediente excluido: `opacity-50` + `line-through` + ícono de suma (+).
- Visual de ingrediente incluido: opacidad normal + tacho rojo para quitar.
- Controles de cantidad (`- 1 +`) y "Agregar otro" aparecen solo POST agregado explícito.
- Prevenir event bubbling en botones de ingredientes.

**Non-Goals:**
- No se modifica el modelo de datos del carrito (`CartItem`, `Producto`, etc.).
- No se toca el backend.
- No se modifican otras páginas (solo `ProductoDetallePage`).

## Decisions

### Decisión 1: Estado local con `useState` en vez de ref/callback

| Alternativa | Veredicto |
|-------------|-----------|
| `useState<number[]>([])` en el componente | ✅ Elegido |
| Zustand store separado para selección temporal | ❌ Overkill para estado efímero |
| `useRef` para evitar re-renders | ❌ Necesitamos re-render para UI |

**Por qué**: La exclusión de ingredientes es estado puramente UI, efímero, que se descarta al salir de la página. No persiste, no se comparte entre componentes. `useState` es la herramienta correcta.

### Decisión 2: Merge de excludedIngredients al carrito solo en el "Add to Cart"

El flujo nuevo:

```
Usuario clickea ingrediente → solo actualiza excludedIngredients local (useState)
Usuario clickea "Agregar al carrito" →
  1. Si NO existe en carrito → cart.addItem(producto, 1, excludedIngredients)
  2. Si YA existe → cart.updateItemExclusions(producto.id, excludedIngredients)
```

El método `toggleExcludeIngrediente` del `cartStore` **no se usa más** desde `ProductoDetallePage` (se reemplaza por estado local).

### Decisión 3: Flag `hasAddedToCart` local para controlar UI del botón CTA

Agregamos un segundo estado local `hasAddedToCart` (booleano) que se pone `true` SOLO cuando el usuario clickea "Agregar al carrito". Los controles de cantidad y "Agregar otro" se muestran solo si `hasAddedToCart === true`, independientemente de si el item ya estaba en el carrito antes de entrar a la página.

**Alternativa**: Checkear `itemInCart()` directamente → ❌ porque si el usuario ya tenía el producto en el carrito de antes, al entrar a la página ya vería los controles sin haber interactuado. El flag local resuelve esto.

**Edge case**: Si el usuario agrega al carrito, recarga la página, y el producto sigue en el carrito → el flag se reinicia a `false` y los controles no aparecen hasta que vuelva a clickear "Agregar al carrito". Esto es aceptable y consistente.

### Decisión 4: Sin `stopPropagation` adicional (no hay wrappers clickeables)

Los botones de ingredientes están dentro de un `<li>` que no tiene onClick, solo el botón mismo. El event bubbling no es un problema actual, pero se agrega `e.preventDefault()` en el handler por seguridad.

## Risks / Trade-offs

- **[Riesgo] El estado local se pierde al salir de la página**: Si el usuario personaliza ingredientes, navega a otro lado, y vuelve, la selección se reinicia. → **Aceptado**: es el comportamiento esperado. Si se quisiera persistir, sería un feature futuro (sesión temporal).
- **[Trade-off] Flag `hasAddedToCart` se resetea al recargar**: Si el usuario ya tenía el producto en el carrito, al recargar la página no ve los controles hasta que clickea "Agregar al carrito" de nuevo. → El cartStore mantiene la cantidad anterior y se suma. Es coherente con la idea de que "Agregar al carrito" es la acción explícita.
- **[Cobertura] Si el usuario excluye ingredientes, agrega al carrito, y luego cambia de opinión**: El segundo "Agregar al carrito" actualiza las exclusiones del ítem en el carrito (merge). No se crea un nuevo item.
