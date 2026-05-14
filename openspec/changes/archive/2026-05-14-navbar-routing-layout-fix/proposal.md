# Proposal: navbar-routing-layout-fix

## Why

El Navbar del cliente (`ClientLayout.tsx`) tiene problemas de usabilidad y diseño: el logo no es clickeable, los links de navegación están excesivamente separados, y el logo tiene poco peso visual. Esto perjudica la experiencia de navegación del usuario.

## What Changes

- Envolver el logo en un `<Link to="/productos">` para navegación
- Reemplazar `justify-between` por estructura flex centrada con gap controlado
- Eliminar el spacer `w-[42px]` de balanceo
- Aumentar el logo de `text-2xl` a `text-3xl`
- Verificar que "Volver a Productos" ya usa enlace absoluto (no requiere cambios)

## Files

- `frontend/src/components/layout/ClientLayout.tsx`

## Risks

- El layout responsive puede cambiar en mobile (los links se ocultan con `hidden md:flex`, pero la estructura `justify-between` afecta el espaciado general)
- El aumento del logo puede comprimir los links en pantallas medianas (`md`)
