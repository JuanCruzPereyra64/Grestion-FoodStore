# Tasks: critical-navbar-routing-fix

## 1. Layout Grid

- [x] 1.1 Reemplazar `flex` por `grid grid-cols-3` en el contenedor del navbar
- [x] 1.2 Col 1: mover solo el avatar/dropdown con `justify-self-start`
- [x] 1.3 Col 2: crear contenedor flex centrado con enlaces + logo agrupados con `gap-8`
- [x] 1.4 Col 3: agregar div vacío de balance

## 2. Verificación

- [x] 2.1 Verificar que el logo navega a `/productos`
- [x] 2.2 Verificar que "Volver a Productos" usa enlace absoluto
- [x] 2.3 Verificar layout cohesivo en desktop y mobile
- [x] 2.4 Correr `tsc --noEmit` para asegurar que no hay errores de tipo
