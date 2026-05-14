# Design: critical-navbar-routing-fix

## Context

El navbar cliente usa flex con secciones `flex-1` que no logran agrupar correctamente los enlaces alrededor del logo. Los enlaces quedan separados del centro visual.

## Goals / Non-Goals

**Goals:**
- Layout `grid-cols-3` estricto para 3 secciones balanceadas
- Columna izquierda: solo avatar
- Columna central: grupo flex con enlaces + logo
- Columna derecha: spacer vacío de balance

**Non-Goals:**
- NO cambiar el dropdown de usuario
- NO modificar el enrutamiento (ya está correcto)
- NO modificar ProductoDetallePage
- NO cambiar backend

## Decisions

### D1. Grid en vez de flex para el contenedor principal
- **Decisión**: Usar `grid grid-cols-3` en el div contenedor del navbar
- **Por qué**: Garantiza que las 3 secciones ocupen exactamente 1/3 del ancho cada una, forzando el centrado perfecto de la columna media sin importar el contenido
- **Alternativa considerada**: `flex-1` — descartada porque el contenido de las secciones laterales (avatar pequeño vs vacío) desbalancea el centro

### D2. Columna central como flex anidado
- **Decisión**: Dentro de la columna 2, usar un contenedor `flex justify-center items-center gap-8`
- **Por qué**: Agrupa todos los enlaces y el logo como una unidad cohesiva centrada en el espacio disponible

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| En mobile el grid puede verse mal con 3 columnas | Los enlaces se ocultan con `hidden md:flex`, en mobile solo quedan avatar + logo + spacer, el `grid-cols-3` mantiene el logo centrado |
| El logo `text-3xl` puede forzar salto de línea en pantallas estrechas | El `gap-8` en la columna central se reduce naturalmente; si es necesario, ajustar a `gap-4 md:gap-8` |
