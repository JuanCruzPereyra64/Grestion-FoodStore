# Proposal: force-hero-glass-card

## Why

Cambios anteriores no se aplicaron correctamente. Se necesita una tarjeta glassmorphism centrada con clases exactas.

## What Changes

- New wrapper div con clases exactas: `w-[90%] max-w-5xl mx-auto bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 my-10 flex flex-col items-center`
- Eliminar blur layer separado (gradient mask)
- El fondo de ladrillos queda en `body::before` intacto

## Files

- `frontend/src/pages/ClientHomePage.tsx`
