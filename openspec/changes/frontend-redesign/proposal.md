# Proposal: Frontend Redesign (Premium Polish)

## Intent

Modernizar integralmente la interfaz de usuario del "UTN Parcial" para transformar una estética básica y "asquerosa" (según el usuario) en una experiencia premium, profesional y dinámica. El objetivo es impresionar visualmente manteniendo la funcionalidad del sistema de gestión de productos.

## Scope

### In Scope
- Nueva paleta de colores curada y sistema de tipografía (Inter/Outfit).
- Layout principal rediseñado (Sidebar moderno o Nav premium).
- Componentes comunes renovados: Modals (glassmorphism), Tablas (espaciado dinámico), Botones (micro-interacciones).
- Soporte de Dark Mode sofisticado.
- Micro-animaciones para transiciones de estados y carga.

### Out of Scope
- Reescritura del backend.
- Cambios en el modelo de datos (DB).
- Nuevas funcionalidades de negocio no solicitadas.

## Capabilities

### New Capabilities
- `ui-design-system`: Definición de tokens, colores, tipografía y componentes base.

### Modified Capabilities
- `categoria-management`: Interfaz de usuario mejorada.
- `ingrediente-management`: Interfaz de usuario mejorada.
- `producto-management`: Interfaz de usuario mejorada.

## Approach

1. **Fundamentos**: Definir un nuevo sistema de diseño en `index.css` usando las capacidades de Tailwind 4 (tokens `@theme`).
2. **Componentes**: Refactorizar `Modal.tsx` y otros componentes compartidos.
3. **Layout**: Crear un wrapper de layout más profesional en `App.tsx`.
4. **Páginas**: Aplicar el nuevo estilo a cada página, mejorando tablas y formularios.
5. **Animaciones**: Integrar Framer Motion para entradas suaves y feedback visual.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/index.css` | Modified | Nuevo sistema de diseño (colores, fuentes, utilidades). |
| `frontend/src/App.tsx` | Modified | Nuevo Layout y navegación. |
| `frontend/src/components/` | Modified | Rediseño de componentes comunes. |
| `frontend/src/pages/` | Modified | Aplicación del rediseño a todas las vistas. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Romper la responsividad | Medium | Usar Mobile-First y probar con el browser tool. |
| Conflictos con Tailwind 4 | Low | Seguir la documentación oficial de migración/config. |

## Rollback Plan

Revertir a los commits anteriores de los archivos CSS y componentes del frontend.

## Dependencies

- `framer-motion` (opcional, recomendado para micro-animaciones premium).
- `lucide-react` (para iconos modernos).

## Success Criteria

- [ ] Look & Feel premium y moderno (evaluado visualmente).
- [ ] UI consistente en todas las páginas.
- [ ] Navegación fluida y responsiva.
- [ ] Feedback visual claro en acciones (hover, loading, success).
