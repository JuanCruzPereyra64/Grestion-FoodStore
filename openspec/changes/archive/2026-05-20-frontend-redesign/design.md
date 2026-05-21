# Design: Frontend Redesign

## Technical Approach

Implementar un sistema de diseño "Glassmorphic Minimalist" utilizando Tailwind 4. Se centralizarán los tokens de diseño en `index.css` y se refactorizarán los componentes críticos para asegurar consistencia. Se priorizará la legibilidad, el espaciado generoso y las micro-interacciones suaves.

## Architecture Decisions

### Decision: Tailwind 4 Native Tokens

**Choice**: Usar el bloque `@theme` de Tailwind 4 para definir variables CSS nativas.
**Alternatives considered**: CSS Variables manuales en `:root`.
**Rationale**: Tailwind 4 integra mejor las variables de tema, permitiendo autocompletado y una sintaxis más limpia en el HTML sin necesidad de `config.js`.

### Decision: Sidebar Navigation

**Choice**: Cambiar de un Top Nav básico a un Sidebar lateral fijo con efectos de blur (glassmorphism).
**Alternatives considered**: Rediseñar el Top Nav.
**Rationale**: Un sidebar permite una jerarquía de navegación más profesional en apps de gestión y ofrece más espacio para Branding.

### Decision: Framer Motion para Feedback

**Choice**: Integrar Framer Motion para entradas de páginas y estados de carga.
**Alternatives considered**: CSS Transitions puras.
**Rationale**: Framer Motion simplifica animaciones de salida (AnimatePresence) y gestos (hover/tap) que son esenciales para un look "premium".

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `frontend/src/index.css` | Modify | Reemplazo de estilos globales por sistema de tokens. |
| `frontend/src/App.tsx` | Modify | Refactor a Layout con Sidebar y transiciones. |
| `frontend/src/components/common/Modal.tsx` | Modify | Nuevo modal con backdrop animado y estilo glass. |
| `frontend/src/pages/CategoriasPage.tsx` | Modify | Ajuste a nuevos estilos de tabla y botones. |
| `frontend/src/pages/IngredientesPage.tsx` | Modify | Ajuste a nuevos estilos de tabla y botones. |
| `frontend/src/pages/ProductosPage.tsx` | Modify | Ajuste a nuevos estilos de tabla y botones. |
| `frontend/src/pages/ProductoDetallePage.tsx` | Modify | Rediseño de la vista detalle con componentes tipo Card. |

## Interfaces / Contracts

No se modifican interfaces de TypeScript, solo se añaden props opcionales de estilo si fuera necesario.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | Consistencia de componentes | Verificación manual con el browser tool. |
| Responsividad | Breakpoints (Móvil/Tablet/Desktop) | Verificación manual con el browser tool. |

## Migration / Rollout

No requiere migración de datos. Aplicación directa sobre el frontend actual.

## Open Questions

- [ ] ¿Damos soporte completo a Dark Mode desde el inicio o lo priorizamos para una segunda fase? (Se asume soporte inicial por requerimiento de "Aesthetics").
