# Tasks: Fix Product-Ingredient Service Bug

## Phase 1: Cleanup

- [x] 1.1 En `backend/services/producto_service.py`, eliminar la primera definición de `remove_ingrediente` (líneas 117-128 completas, incluyendo el código muerto de las líneas 124-128)
- [x] 1.2 Verificar que la definición restante (antes línea 131, ahora línea 117) tiene exactamente: `session.get` → 404 si no existe → `session.delete` → `session.commit` → `return get_by_id`
- [x] 1.3 Verificar que el mensaje de error es `"Ingrediente no presente en el producto"`

## Phase 2: Verificación Manual

- [x] 2.1 Confirmar que `producto_service.remove_ingrediente` resuelve a UNA sola función en el módulo
- [x] 2.2 Confirmar que no existe ningún `session.add(ProductoIngrediente(...))` dentro de `remove_ingrediente`
- [x] 2.3 Confirmar que no hay código después de ningún `return` en el archivo (`producto_service.py`)
