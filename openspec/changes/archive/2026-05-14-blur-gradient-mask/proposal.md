# Proposal: blur-gradient-mask

## Why

El `backdrop-blur-md` sobre la glass card centrada crea un rectángulo de blur con bordes duros que se corta abruptamente contra el fondo de ladrillos.

## What Changes

- Separar `backdrop-blur-md` de la glass card a una capa `fixed` independiente
- Aplicar `mask-image: radial-gradient(ellipse ...)` para que el blur se desvanezca gradualmente hacia los costados
- La glass card se queda solo con `bg-black/60` (sin blur propio)

## Files

- `frontend/src/pages/ClientHomePage.tsx`
