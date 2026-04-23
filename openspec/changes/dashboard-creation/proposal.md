# Proposal: Gourmet Dashboard Creation

## Intent

Implementar una página de inicio (`/`) que funcione como un Dashboard centralizado. El objetivo es dar una visión global del sistema (estadísticas) y facilitar el flujo de trabajo mediante accesos directos, en lugar de redirigir directamente a la gestión de categorías.

## Scope

### In Scope
- Nueva página `HomePage.tsx`.
- Tarjetas de estadísticas (Total de Productos, Categorías, Ingredientes).
- Sección de "Acciones Rápidas" para flujos comunes.
- Componente de "Highlight" (ej: producto más caro o última categoría añadida).
- Actualización de navegación en Sidebar.

### Out of Scope
- Backend para nuevas estadísticas complejas (usaremos los hooks actuales).
- Gráficos avanzados con librerías externas (se usarán componentes CSS simples).

## Capabilities

### New Capabilities
- `dashboard-view`: Visualización de métricas y accesos directos.

### Modified Capabilities
- `navigation`: Cambio del punto de entrada predeterminado.

## Approach

1. **Routing**: Modificar `App.tsx` para que `/` cargue `HomePage` y actualizar el Sidebar.
2. **Data**: Utilizar los hooks de `React Query` existentes (`useProductos`, etc.) para obtener los datos en tiempo real.
3. **UI**: Diseñar una grid de tarjetas (Stats) y una sección de bienvenida premium.
4. **Interacción**: Añadir botones de "Quick Action" que redirijan a los modales de creación en otras páginas o directamente a las páginas.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/App.tsx` | Modified | Cambio de rutas. |
| `frontend/src/components/layout/MainLayout.tsx` | Modified | Añadir Dashboard al Sidebar. |
| `frontend/src/pages/HomePage.tsx` | New | Nueva página principal. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Rendimiento al cargar todo | Low | React Query cachea los datos eficientemente. |

## Rollback Plan

Revertir cambios en `App.tsx` para volver a la redirección predeterminada.

## Success Criteria

- [ ] La app inicia en `/` con el Dashboard.
- [ ] Las estadísticas muestran datos reales.
- [ ] El diseño mantiene la estética premium.
