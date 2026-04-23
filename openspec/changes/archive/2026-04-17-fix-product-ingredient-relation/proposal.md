# Proposal: Fix Product-Ingredient Service Bug

## Intent

`producto_service.py` tiene dos definiciones de `remove_ingrediente`. Python usa la segunda y silencia la primera. La primera contiene código muerto (lógica de agregar un link después del `return`) que nunca ejecuta. Esto confunde la lectura del código, crea riesgo de regresión en futuras ediciones, y evidencia una intención rota (agregar vs. eliminar). El fix limpia la duplicación sin cambiar el comportamiento en runtime.
Additionally, the presence of dead code that creates a ProductoIngrediente link inside a removal function indicates a broken developer intent and increases the risk of future bugs.
## Scope

### In Scope
- Eliminar la primera definición duplicada de `remove_ingrediente` (líneas 117-128)
- Eliminar el código muerto (líneas 124-128) que nunca se ejecuta
- Conservar únicamente la segunda definición (líneas 131-137) con el mensaje correcto

### Out of Scope
- Cambios en la API pública del endpoint `/productos/{id}/ingredientes/{id}`
- Refactor de `add_ingrediente` (funciona correctamente)
- Cambios en modelos, schemas o routers

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- None

> Justificación: el comportamiento en runtime ya usa la segunda definición. Esto es un refactor de código muerto — no cambia ningún contrato de specs.

## Approach

Eliminar líneas 117-128 de `backend/services/producto_service.py`. La función que Python ejecutaba (líneas 131-137) permanece intacta como la única definición.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/services/producto_service.py` | Modified | Eliminar primera definición duplicada + código muerto |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Borrar la definición equivocada | Low | Verificar que la definición retenida tenga el mensaje "Ingrediente no presente en el producto" |

## Rollback Plan

`git revert` del commit. El cambio es una eliminación de líneas — reversible trivialmente.

## Dependencies

- None

## Success Criteria

- [ ] `producto_service.py` tiene exactamente una definición de `remove_ingrediente`
- [ ] La función retenida lanza 404 con "Ingrediente no presente en el producto" cuando el link no existe
- [ ] La función retenida elimina el link y devuelve el producto actualizado
- [ ] No existe código después de un `return` en ninguna función del módulo
