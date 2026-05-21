# Tasks: Client Product Card Fix

## 1. Limpiar imports y estado

- [x] 1.1 Eliminar `useAddIngrediente`, `useRemoveIngrediente`, `useIngredientes` de los hooks importados
- [x] 1.2 Eliminar `Plus`, `Trash2` de los íconos importados
- [x] 1.3 Eliminar `useState` de `ingredienteSeleccionado`

## 2. Refactor columna derecha (ingredientes)

- [x] 2.1 Ocultar span de cantidad técnica (`{ing.cantidad_requerida}{ing.unidad_medida}`)
- [x] 2.2 Mantener badge de alérgeno visible
- [x] 2.3 Hacer toggle de exclusión permanente (no condicional a `cartItem`)
- [x] 2.4 Eliminar botón Trash2 de cada ingrediente
- [x] 2.5 Simplificar `motion.li` — remover hover group (ya no hay Trash2)

## 3. Eliminar sección admin "Añadir a la receta"

- [x] 3.1 Remover bloque JSX de "Añadir a la receta" (select + botón)
- [x] 3.2 Remover variable `ingredientesDisponibles` (ya no se necesita)

## 4. Consolidar CTA y stock

- [x] 4.1 Deshabilitar botón "Agregar al carrito" cuando `puede_prepararse = false`
- [x] 4.2 Verificar que todos los textos en la página usen `dark:text-white`

## 5. Verificación

- [x] 5.1 Correr `tsc --noEmit` y confirmar sin errores
- [x] 5.2 Rebuild Docker
