## 1. Refactor estado de ingredientes: de global a local

- [x] 1.1 Reemplazar `const excludedIds = new Set(cartItem?.excludedIngredienteIds ?? [])` por `const [excludedIngredients, setExcludedIngredients] = useState<number[]>([])`
- [x] 1.2 Modificar `handleToggleExclude` para que solo actualice `excludedIngredients` local — sin llamar a `cart.addItem()` ni `cart.toggleExcludeIngrediente()`
- [x] 1.3 Agregar `e.preventDefault()` en el onclick del botón de ingrediente
- [x] 1.4 Verificar que los ingredientes se rendericen contra `excludedIngredients` local en vez de `excludedIds` del carrito

## 2. Corregir visual de ingredientes excluidos

- [x] 2.1 Estado incluido (default): opacidad normal (`opacity-100`), texto blanco, ícono `Trash2` rojo a la derecha, tooltip "Excluir ingrediente"
- [x] 2.2 Estado excluido: `opacity-50`, `line-through text-gray-500`, ícono `Plus` (de lucide-react) gris/verde tenue, tooltip "Incluir ingrediente"
- [x] 2.3 Eliminar el fondo rojo en estado excluido (reemplazar por fondo neutral/subtle)

## 3. Implementar flag local `hasAddedToCart` para UI del botón CTA

- [x] 3.1 Agregar `const [hasAddedToCart, setHasAddedToCart] = useState(false)`
- [x] 3.2 Modificar `handleAddToCart`: al agregar al carrito, hacer `setHasAddedToCart(true)` y pasar `excludedIngredients` como tercer argumento
- [x] 3.3 Mostrar controles de cantidad (`- 1 +`) y "Agregar otro" SOLO si `hasAddedToCart === true`, no si solo `cartItem` existe
- [x] 3.4 Si el producto ya está en el carrito (de sesión anterior), mostrar texto informativo pero no controles hasta que clickee "Agregar al carrito"

## 4. Merge final al carrito solo en "Agregar al carrito"

- [x] 4.1 En `handleAddToCart`: si el producto NO está en carrito → `cart.addItem(producto, 1, excludedIngredients)`
- [x] 4.2 En `handleAddToCart`: si el producto YA está en carrito → actualizar exclusiones con `excludedIngredients` actual e incrementar cantidad
- [x] 4.3 Verificar que `toggleExcludeIngrediente` del cartStore ya no se invoca desde `ProductoDetallePage`

## 5. Verificación de TypeScript y build

- [x] 5.1 Ejecutar `npx tsc --noEmit` y no tener errores
- [x] 5.2 Verificar que el componente compile sin warnings
