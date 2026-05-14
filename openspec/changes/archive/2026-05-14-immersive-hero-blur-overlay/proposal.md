# Proposal: immersive-hero-blur-overlay

## Why

El contenido del home (hero, features, CTA) se renderiza directamente sobre el fondo de ladrillos con solo un gradiente oscuro (`body::after`). El texto y las tarjetas no tienen suficiente contraste ni un panel contenedor que mejore la legibilidad.

## What Changes

- Envolver todo el contenido de `ClientHomePage` en un panel `bg-black/60 backdrop-blur-md min-h-screen`
- Usar `max-w-7xl mx-auto` para centrar el contenido y limitar su ancho
- Cambiar textos de `text-slate-300` a `text-white` para máximo contraste

## Files

- `frontend/src/pages/ClientHomePage.tsx`
