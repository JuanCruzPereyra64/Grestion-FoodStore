# Proposal: logo-home-link

## Why

El logo ya está envuelto en `<Link>` pero apunta a `/productos`. Debe apuntar a `/` (home) para que el usuario vuelva al inicio desde cualquier página.

## What Changes

- Cambiar `<Link to="/productos">` → `<Link to="/">` en `ClientLayout.tsx`

## Files

- `frontend/src/components/layout/ClientLayout.tsx`
