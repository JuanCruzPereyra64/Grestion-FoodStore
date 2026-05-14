# Proposal: critical-navbar-routing-fix

## Why

El navbar del cliente sigue teniendo problemas de layout: las secciones de links no están correctamente agrupadas. El enfoque anterior con `flex-1` no logró centrar correctamente el grupo de links + logo como una unidad cohesiva.

## What Changes

- Reestructurar el navbar a layout `grid-cols-3`:
  - **Col 1 (Left)**: Solo avatar de usuario, alineado a la izquierda
  - **Col 2 (Center)**: Un contenedor flex con `justify-center gap-8` que agrupa: [Conocenos, Productos] + Logo + [Descuentos, Envíos]
  - **Col 3 (Right)**: Div vacío que equilibra el espacio del avatar
- Verificar que "Volver a Productos" usa `<Link to="/productos">` (ya está correcto)
- Verificar que el Logo usa `<Link to="/productos">` (ya está correcto del change anterior)

## Files

- `frontend/src/components/layout/ClientLayout.tsx`

## Risks

- En mobile, el grid puede desbalancearse — los links están ocultos con `hidden md:flex`, el avatar y logo centrado deberían funcionar bien
