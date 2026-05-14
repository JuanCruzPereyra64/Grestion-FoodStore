# Design: hero-glass-card

## Context

El change anterior (`immersive-hero-blur-overlay`) usaba un overlay full-width. Tras revisión, se prefiere un contenedor tipo tarjeta centrado que muestre el fondo de ladrillos a los costados.

## Goals / Non-Goals

**Goals:**
- Glass card centrada con `max-w-5xl w-[90%]`
- Efecto glassmorphism: `bg-black/60 backdrop-blur-md rounded-3xl border border-white/10`
- Hero + Features dentro de la card; CTA fuera
- Texto en `text-gray-200` para descripciones

**Non-Goals:**
- NO cambiar el CTA section internamente
- NO modificar el fondo global
- NO tocar otros componentes

## Decisions

### D1. Card envuelve Hero + Features, no CTA
- El CTA section se queda fuera de la glass card, apoyado directamente sobre el fondo de ladrillos

### D2. padding del Hero reducido
- Hero pasa de `py-20 md:py-32` a `py-10 md:py-16` porque la card ya aporta padding con `p-10 md:p-12`
- Se elimina el gradiente interno `from-slate-900/50` (redundante con `bg-black/60`)

### D3. Texto en text-gray-200
- Feature descriptions y CTA text cambian a `text-gray-200` para mejor contraste
