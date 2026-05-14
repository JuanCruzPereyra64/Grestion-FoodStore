# Proposal: hero-glass-card

## Why

El overlay `bg-black/60 backdrop-blur-md min-h-screen` anterior ocupaba todo el ancho. Necesitamos un contenedor tipo tarjeta centrado que deje ver el fondo de ladrillos a los costados, mejorando la legibilidad sin sacrificar la estética del fondo.

## What Changes

- Reemplazar glass overlay full-width por una glass card centrada: `max-w-5xl mx-auto w-[90%] bg-black/60 backdrop-blur-md rounded-3xl p-10 md:p-12 border border-white/10 my-10`
- La glass card envuelve Hero + Features (NO el CTA)
- Textos descriptivos pasan de `text-slate-400` a `text-gray-200`

## Files

- `frontend/src/pages/ClientHomePage.tsx`
