# Design: Gourmet Dashboard

## Technical Approach

El Dashboard se implementará como una vista reactiva que consume los mismos hooks de `useCategorias`, `useIngredientes` y `useProductos` utilizados en las páginas de gestión. Esto asegura que los datos estén sincronizados. La UI seguirá el patrón de "Bento Box" o Grid de estadísticas con una cabecera de bienvenida impactante.

## Architecture Decisions

### Decision: React Query Integration

**Choice**: Usar los hooks existentes directamente en `HomePage.tsx`.
**Alternatives considered**: Crear un nuevo hook `useDashboardStats`.
**Rationale**: Los hooks actuales ya manejan el fetch y el cache. Crear uno nuevo duplicaría lógica a menos que el backend ofreciera un endpoint de stats, lo cual no es el caso.

### Decision: Quick Action Shortcuts

**Choice**: Los botones de acción rápida redirigirán a las páginas correspondientes (ej: `/productos`) y, opcionalmente, podríamos pasar un flag para abrir el modal, pero para mantener la simplicidad inicial, solo redirigiremos a las vistas de gestión.
**Rationale**: Evita la complejidad de manejar estados de modales globales entre rutas en esta fase.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `frontend/src/pages/HomePage.tsx` | Create | Componente principal del Dashboard. |
| `frontend/src/App.tsx` | Modify | Reemplazar redirección root por `HomePage`. |
| `frontend/src/components/layout/MainLayout.tsx` | Modify | Añadir link de Dashboard con icono `LayoutDashboard`. |

## Key Components to Implement

### `StatsCard`
Componente basado en `Card` que muestra:
- Icono.
- Título (ej: "Productos").
- Valor (length del array).
- Trend decorativo (ej: "Ver todos →").

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | Renderizado de Dashboard | Verificación manual con browser tool. |
| Integración | Sincronización de datos | Añadir un producto y verificar que el contador en el Dashboard aumente. |

## Open Questions

- [ ] ¿Queremos mostrar el "Producto más caro" o algún otro dato destacado como "Últimos añadidos"? (Se implementará como extra si el tiempo permite).
